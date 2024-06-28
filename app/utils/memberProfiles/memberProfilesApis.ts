import { IMemberProfile, IMemberProfiles } from "./types/IMemberProfiles";
import { MemberProfileRequestBody } from "./types/MemberProfileRequestBody";


// Fetch All Profiles
export async function fetchProfiles(): Promise<IMemberProfiles> {
  const response = await fetch('/api/memberProfiles');
  if (!response.ok) {
    const errorText = await response.json();
    throw new Error(errorText?.message);
  }
  return response.json();
}

// Fetch founder
export async function fetchFounder(): Promise<IMemberProfile> {
  const response = await fetch('/api/memberProfiles/founder');
  if (!response.ok) {
    const errorText = await response.json();
    throw new Error(errorText?.message);
  }
  return response.json();
}

// Fetch lead pastor
export async function fetchLeadPastor(): Promise<IMemberProfile> {
  const response = await fetch('/api/memberProfiles/leader');
  if (!response.ok) {
    const errorText = await response.json();
    throw new Error(errorText?.message);
  }
  return response.json();
}

export async function fetchProfileByID(id: string): Promise<IMemberProfile> {
  const response = await fetch(`/api/memberProfiles/${id}`);
  if (!response.ok) {
    const errorText = await response.json();
    throw new Error(errorText?.message);
  }
  return response.json();
}

// create membership profile
export async function createProfile(profileData: MemberProfileRequestBody): Promise<IMemberProfile> {
    try {
      const response = await fetch('/api/memberProfiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
  
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      return responseData; // Assuming the response follows the ApiResponse structure
    } catch (error) {
      return { success: false, message: `${error }`, data: {} as any };
    }
}

// update membership profile
export async function updateProfile(updateData: IMemberProfile['data'], id: string): Promise<IMemberProfile> {
  try {
    const response = await fetch(`/api/memberProfiles/update-profile/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },    
      body: JSON.stringify(updateData),
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message);
    }
    return responseData; // Assuming the response follows the ApiResponse structure
  } catch (error) {
    return { success: false, message: `${error }`, data: {} as any };
  }
}

export async function deleteProfile(id:string): Promise<any> {
  try {
    const response = await fetch(`/api/memberProfiles/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const responseData = await response.json() as {success:boolean; message: string;}
    if (!response.ok) {
      throw new Error(responseData.message);
    }
    return responseData; // Assuming the response follows the ApiResponse structure
  } catch(err){
    throw new Error(`this is the error: ${err}`);
  }
}
  