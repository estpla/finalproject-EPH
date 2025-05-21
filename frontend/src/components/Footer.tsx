
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t py-6 mt-auto">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} GymTrack Pro - Gestión de entrenamientos en tiempo real
          </div>
          <div className="text-sm text-muted-foreground">
            Versión 1.0.0
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
