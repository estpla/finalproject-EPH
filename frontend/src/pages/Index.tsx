
import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SimplifiedAthleteCard from "@/components/SimplifiedAthleteCard";
import AddAthleteDialog from "@/components/AddAthleteDialog";
import { GymProvider } from "@/context/GymContext";
import { useGym } from "@/context/GymContext";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

const AUTO_SCROLL_INTERVAL = 10000; // 10 seconds

const HomeContent = () => {
  const { athletes } = useGym();
  const activeAthletes = athletes.filter(
    (athlete) => athlete.status === "active"
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const itemsPerPage = 9; // Adjust based on screen size
  const totalPages = Math.ceil(activeAthletes.length / itemsPerPage);

  const startAutoScroll = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    
    autoScrollRef.current = setInterval(() => {
      if (autoScroll) {
        setCurrentPage(prev => (prev + 1) % totalPages);
      }
    }, AUTO_SCROLL_INTERVAL);
  };

  useEffect(() => {
    if (activeAthletes.length > itemsPerPage) {
      startAutoScroll();
    }
    
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [autoScroll, activeAthletes.length, totalPages]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setAutoScroll(false);
    
    // Resume auto-scrolling after 30 seconds of inactivity
    setTimeout(() => {
      setAutoScroll(true);
    }, 30000);
  };

  const currentAthletes = activeAthletes.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {activeAthletes.length === 0 ? (
          <div className="col-span-full p-6 bg-muted/40 rounded-lg text-center">
            <h3 className="text-lg font-medium text-muted-foreground">
              No hay atletas activos en este momento
            </h3>
            <p className="text-sm text-muted-foreground">
              Añade un atleta y asígnale una rutina para comenzar.
            </p>
          </div>
        ) : (
          currentAthletes.map((athlete) => (
            <SimplifiedAthleteCard key={athlete.id} athlete={athlete} />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentPage === i}
                  onClick={() => handlePageChange(i)}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

const Index = () => {
  return (
    <GymProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="container mx-auto px-4 flex-1 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Atletas activos</h2>
          </div>
          
          <HomeContent />
        </main>
        
        <Footer />
      </div>
    </GymProvider>
  );
};

export default Index;
