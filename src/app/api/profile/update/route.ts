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
    const { 
      name, phone, dob, address, 
      image,
      bookingNotifications, messageNotifications, otpNotifications, marketingNotifications,
      language, theme, profileVisible, locationSharing, showOnlineStatus,
      fontSize, reducedAnimations, highContrast,
      reviewNotifications, promotionalNotifications, systemNotifications,
      preferredCategories, favoriteServices,

      locationAddress, hourlyRate, skills, profession, customProfession,
      workingHours, availabilityStatus, languages, portfolio,
      serviceAvailability, serviceAreas, paymentPreference
    } = body;

    // Build update data dynamically for User
    const userData: any = {};
    if (name !== undefined) userData.name = name;
    if (phone !== undefined) userData.phone = phone || null;
    if (address !== undefined) userData.address = address || null;
    if (dob !== undefined) userData.dob = dob ? new Date(dob) : null;
    if (image !== undefined) userData.image = image || null;
    
    if (bookingNotifications !== undefined) userData.bookingNotifications = !!bookingNotifications;
    if (messageNotifications !== undefined) userData.messageNotifications = !!messageNotifications;
    if (otpNotifications !== undefined) userData.otpNotifications = !!otpNotifications;
    if (marketingNotifications !== undefined) userData.marketingNotifications = !!marketingNotifications;

    // New preferences
    if (language !== undefined) userData.language = language;
    if (theme !== undefined) userData.theme = theme;
    if (profileVisible !== undefined) userData.profileVisible = !!profileVisible;
    if (locationSharing !== undefined) userData.locationSharing = !!locationSharing;
    if (showOnlineStatus !== undefined) userData.showOnlineStatus = !!showOnlineStatus;
    if (fontSize !== undefined) userData.fontSize = fontSize;
    if (reducedAnimations !== undefined) userData.reducedAnimations = !!reducedAnimations;
    if (highContrast !== undefined) userData.highContrast = !!highContrast;
    if (reviewNotifications !== undefined) userData.reviewNotifications = !!reviewNotifications;
    if (promotionalNotifications !== undefined) userData.promotionalNotifications = !!promotionalNotifications;
    if (systemNotifications !== undefined) userData.systemNotifications = !!systemNotifications;
    
    if (preferredCategories !== undefined) {
      userData.preferredCategories = Array.isArray(preferredCategories) ? preferredCategories : [];
    }
    if (favoriteServices !== undefined) {
      userData.favoriteServices = Array.isArray(favoriteServices) ? favoriteServices : [];
    }

    // Update User
    const updatedUser = await prisma.user.update({
      where: { email: user.email },
      data: userData,
      include: {
        workerProfile: true,
      }
    });

    // If user is a worker, update worker profile details
    if (updatedUser.workerProfile) {
      const updateData: any = {};
      if (locationAddress !== undefined) updateData.locationAddress = locationAddress || null;
      if (hourlyRate !== undefined) updateData.hourlyRate = hourlyRate ? parseFloat(hourlyRate) : null;
      if (workingHours !== undefined) updateData.workingHours = workingHours || null;
      if (availabilityStatus !== undefined) updateData.availabilityStatus = availabilityStatus || "AVAILABLE";
      
      // New worker settings
      if (serviceAvailability !== undefined) updateData.serviceAvailability = !!serviceAvailability;
      if (serviceAreas !== undefined) {
        updateData.serviceAreas = Array.isArray(serviceAreas) ? serviceAreas : [];
      }
      if (paymentPreference !== undefined) updateData.paymentPreference = paymentPreference;

      if (languages !== undefined) {
        updateData.languages = Array.isArray(languages) ? languages : (languages ? [languages] : []);
      }
      if (portfolio !== undefined) {
        updateData.portfolio = Array.isArray(portfolio) ? portfolio : [];
      }
      
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
