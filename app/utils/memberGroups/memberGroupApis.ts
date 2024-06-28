import mongoose, { Mongoose } from "mongoose";
import { IMemberGroup, IMemberGroups } from "./types/IMemberGroup";
import { MemberGroupRequestBody } from "./types/memberGroupRequestBody";
import { IMemberProfile, IMemberProfiles } from "../memberProfiles/types/IMemberProfiles";

export const createGroup = async (groupData: MemberGroupRequestBody): Promise<IMemberGroup> => {
  try {
    const response = await fetch('/api/memberGroups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(groupData),
    });

    
    const data = await response.json(); 
    
    return data;
  } catch (error) {
    console.error('Error creating group:', error);
    throw new Error(`Error: ${error} `)
  }
};


export const updateGroup = async (groupData: MemberGroupRequestBody, groupId: mongoose.Types.ObjectId): Promise<IMemberGroup> => {
  try {
    const response = await fetch(`/api/memberGroups/${groupId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(groupData),
    });

    console.log('Updating group with data:', JSON.stringify(groupData));

    if (!response.ok) {
      throw new Error('Failed to update group');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log('this is the ERROR: ', error);
    throw new Error(`Error updating group`);
  }
};

export const fetchMemberProfilesBasedOnGroupId  = async (groupId: mongoose.Types.ObjectId): Promise<IMemberProfiles> => {
  try {
    const response = await fetch(`/api/memberGroups/${groupId}/getMemberProfiles`,
    {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) {
    throw new Error('Failed to update the group.');
  }
  const data = await response.json(); 
  return data;
  } catch(err){
    console.error('Error updating group:', err);
    throw new Error(`Error: ${err} `)
  }
}
export const fetchMemberProfileBasedOnGroupId  = async (groupId: mongoose.Types.ObjectId): Promise<IMemberProfile> => {
  try {
    const response = await fetch(`/api/memberGroups/${groupId}/getMemberProfiles`,
    {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) {
    throw new Error('Failed to update the group.');
  }
  const data = await response.json(); 
  return data;
  } catch(err){
    console.error('Error updating group:', err);
    throw new Error(`Error: ${err} `)
  }
}
export const DeleteMembeGroupByGroupId  = async (groupId: mongoose.Types.ObjectId): Promise<any> => {
  try {
    const response = await fetch(`/api/memberGroups/${groupId}`,
    {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  });
 
  const data = await response.json(); 
  if (!response.ok) {  
    throw new Error(`${data?.message}`);
  }
  return data;
  } catch(err){
    console.error('Error updating group:', err);
    throw new Error(`Error: ${err} `)
  }
}
export const assignMemberProfileToMemberGroup = async (groupId: mongoose.Types.ObjectId, memberId: mongoose.Types.ObjectId, isLeader?: boolean): Promise<IMemberGroup> => {
  try {
    const response = await fetch(`/api/memberGroups/${groupId}/assignMemberProfile?isLeader=${isLeader}`,
    {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: isLeader ? JSON.stringify({memberId,isLeader}): JSON.stringify({memberId}),
  });
  if (!response.ok) {
    throw new Error('Failed to update the group.');
  }
  const data = await response.json(); 
  return data;
  }catch(err){
    console.error('Error updating group:', err);
    throw new Error(`Error: ${err} `)
  }
}

export const unAssignMemberProfileToMemberGroup = async (groupId: mongoose.Types.ObjectId, memberId: mongoose.Types.ObjectId): Promise<IMemberGroup> => {
  try {
    const response = await fetch(`/api/memberGroups/${groupId}/unassignMemberProfile`,
    {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({memberId}),
  });
  if (!response.ok) {
    throw new Error('Failed to update the group.');
  }
  const data = await response.json(); 
  return data;
  }catch(err){
    console.error('Error un assigning member from group', err);
    throw new Error(`Error: ${err}`)
  }
}

export const fetchGroups = async (): Promise<IMemberGroups> => {
    try {
        const response = await fetch('/api/memberGroups', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          if (!response.ok) {
            throw new Error('Failed to fetch groups');
          }
          const data = await response.json(); 
          return data;
        }catch (error) {
            console.error('Error fetching groups: ', error);
            throw new Error(`Error: ${error} `)
        }
}

export const fetchGroupById = async (groupId: mongoose.Types.ObjectId | string): Promise<IMemberGroup> => {
  try {
    const response = await fetch(`/api/memberGroups/${groupId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch groups');
    }
    const data = await response.json(); 
    return data;
  } catch(error){
    console.error('Error fetching groups: ', error);
    throw new Error(`Error: ${error} `)
  }
}
