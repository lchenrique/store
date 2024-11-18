"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EditProfileModal } from "@/components/modals/edit-profile-modal";
import { useState } from "react";
import { useProfile } from "@/hooks/profile";
import { ProfileSkeleton } from "./skeletons/profile-skeleton";

export function ProfileCard() {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Perfil</h2>
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Nome:</span> {profile.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {profile.email}
          </p>
        </div>
        <Button
          onClick={() => setIsEditProfileOpen(true)}
          variant="outline"
          className="mt-4"
        >
          Editar Perfil
        </Button>

        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          currentName={profile.name || ""}
        />
      </CardContent>
    </Card>
  );
}
