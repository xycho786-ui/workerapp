import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, dob, address, locationAddress, hourlyRate, skills, profession, customProfession } = body;

    // Update User
    const updatedUser = await prisma.user.update({
      where: { email: user.email },
      data: {
        name,
        phone: phone || null,
        address: address || null,
        dob: dob ? new Date(dob) : null,
      },
      include: {
        workerProfile: true,
      }
    });

    // If user is a worker, update worker profile details
    if (updatedUser.workerProfile) {
      const updateData: any = {};
      if (locationAddress !== undefined) updateData.locationAddress = locationAddress || null;
      if (hourlyRate !== undefined) updateData.hourlyRate = hourlyRate ? parseFloat(hourlyRate) : null;
      
      if (profession !== undefined) {
        const professionList = Array.isArray(profession) ? profession : (profession ? [profession] : []);
        updateData.profession = professionList;
        updateData.customProfession = customProfession || '';
        
        // Derive primary category
        let catId = null;
        const primaryProfession = professionList.find(p => p !== 'Others');
        if (primaryProfession) {
          const matchingCategory = await prisma.category.findUnique({
            where: { name: primaryProfession }
          });
          if (matchingCategory) {
            catId = matchingCategory.id;
          } else {
            const icons: Record<string, string> = {
              'Plumbing': '🔧',
              'Electrical': '⚡',
              'Cleaning': '✨',
              'AC Repair': '💨',
              'Painting': '🎨',
              'Carpentry': '🔨',
              'Pest Control': '🐜',
              'Salon': '✂️',
            };
            const icon = icons[primaryProfession] || '🛠️';
            const newCat = await prisma.category.create({
              data: {
                name: primaryProfession,
                icon,
                description: `${primaryProfession} Services`
              }
            });
            catId = newCat.id;
          }
        }
        updateData.categoryId = catId;

        // Derive skills
        let skillsArray = professionList.filter(p => p !== 'Others');
        if (professionList.includes('Others') && customProfession) {
          skillsArray.push(customProfession);
        }
        updateData.skills = skillsArray;
      } else if (skills !== undefined) {
        updateData.skills = skills ? skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
      }

      await prisma.workerProfile.update({
        where: { id: updatedUser.workerProfile.id },
        data: updateData
      });
    }

    return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
