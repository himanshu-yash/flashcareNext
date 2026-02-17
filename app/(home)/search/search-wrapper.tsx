"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Nurse } from "./search.constant";
import { NurseDetailDialog } from "./nurse-detail-dialog";
import { DeploymentDialog } from "./deployment-dialog";
import { SearchClient } from "./search-client";
import { MapPin, Star, ChevronLeft, ChevronRight } from "lucide-react";

interface NursesTableProps {
  readonly nurses: readonly Nurse[];
  // readonly onCheckedNursesChange?: (nurses: Nurse[]) => void;
}

export function SearchWrapper({ nurses }: NursesTableProps) {
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState<string>("name");
  const [filterAvailability, setFilterAvailability] = useState<string>("all");
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deployingNurses, setDeployingNurses] = useState<Nurse[]>([]);
  const [isDeploymentOpen, setIsDeploymentOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredAndSortedNurses = useMemo(() => {
    let filtered = nurses.filter((nurse) => {
      console.log(nurse);
      const availabilityMatch =
        filterAvailability === "all" ||
        nurse.availability_status === filterAvailability;
      return availabilityMatch;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "experience":
          return b.experience_years - a.experience_years;
        case "rating":
          return b.previous_rating - a.previous_rating;
        case "match_score":
          return b.match_score - a.match_score;
        case "rate":
          return a.rate_per_hour - b.rate_per_hour;
        default:
          return 0;
      }
    });
  }, [nurses, sortBy, filterAvailability]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedNurses.length / itemsPerPage);
  
  const paginatedNurses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedNurses.slice(startIndex, endIndex);
  }, [filteredAndSortedNurses, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const checkedNurses = useMemo(
    () => filteredAndSortedNurses.filter((n) => checkedIds.has(n.id)),
    [filteredAndSortedNurses, checkedIds]
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSet = new Set(filteredAndSortedNurses.map((n) => n.id));
      setCheckedIds(newSet);
    } else {
      setCheckedIds(new Set());
    }
  };

  const handleCheckboxChange = (id: number, checked: boolean) => {
    const newSet = new Set(checkedIds);
    if (checked) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    setCheckedIds(newSet);
  };

  const toggleSelectAll = () => {
    handleSelectAll(checkedIds.size !== filteredAndSortedNurses.length);
  };

  //   const exportCheckedData = () => {
  //     const dataStr = JSON.stringify(checkedNurses, null, 2);
  //     const dataBlob = new Blob([dataStr], { type: "application/json" });
  //     const url = URL.createObjectURL(dataBlob);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = `checked-nurses-${new Date().toISOString().split("T")[0]}.json`;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     URL.revokeObjectURL(url);
  //   };

  const handleDeploy = (nurse: Nurse) => {
    setDeployingNurses([nurse]);
    setIsDeploymentOpen(true);
    setIsDialogOpen(false);
  };

  const handleBulkDeploy = () => {
    setDeployingNurses(checkedNurses);
    setIsDeploymentOpen(true);
  };

  const handleDeploymentComplete = () => {
    setCheckedIds(new Set());
    setIsDeploymentOpen(false);
  };

  const handleNurseClick = (nurse: Nurse) => {
    setSelectedNurse(nurse);
    setIsDialogOpen(true);
  };

  // Call the callback when checked nurses change
  //   if (onCheckedNursesChange) {
  //     // onCheckedNursesChange(checkedNurses);
  //   }

  return (
    <div className="w-full space-y-4 p-4">
      {/* header */}
      <div
        data-testid="page-header"
        className="flex items-start justify-between mb-6"
      >
        <div>
          <h1 className="text-3xl font-normal">Nurse Search & AI Matching</h1>
          <p className="text-base font-normal mt-1">
            Find and deploy qualified nurses with intelligent matching
          </p>
        </div>
        <Button
          onClick={handleBulkDeploy}
          disabled={checkedNurses.length === 0}
          data-testid="deploy-selected-btn"
          className="flex items-center gap-1 px-5 py-5 rounded-md text-sm font-semibold text-white transition-all hover:opacity-90"
        >
          Deploy ({checkedNurses.length})
        </Button>
      </div>

      {/* Search Filters */}
      <SearchClient />

      {/* <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <p className="text-sm text-slate-700">
          Selected: <strong>{checkedNurses.length}</strong> of{" "}
          <strong>{filteredAndSortedNurses.length}</strong> nurses
        </p>
      </div> */}

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="">
              <TableHead className="">
                <Checkbox
                  className="rounded-md"
                  checked={
                    filteredAndSortedNurses.length > 0 &&
                    checkedIds.size === filteredAndSortedNurses.length
                  }
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all nurses"
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Credentials</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead className="text-right">Experience</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Distance</TableHead>
              <TableHead className="text-center">Match Score</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead className="text-right">Rating</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedNurses.map((nurse) => (
              <TableRow key={nurse.id} className="hover:bg-slate-50">
                <TableCell>
                  <Checkbox
                    className="rounded-md"
                    checked={checkedIds.has(nurse.id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(nurse.id, checked as boolean)
                    }
                    aria-label={`Select ${nurse.name}`}
                  />
                </TableCell>
                <TableCell
                  className="flex items-center font-medium cursor-pointer text-cyan-600 hover:text-cyan-700"
                  onClick={() => handleNurseClick(nurse)}
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 mr-2">
                    <Image
                      src={nurse.photo}
                      alt={nurse.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm font-normal text-brand-green6">{nurse.name}</span>
                </TableCell>
                <TableCell className="text-sm">{nurse.credentials}</TableCell>
                <TableCell className="text-sm">{nurse.specialty}</TableCell>
                <TableCell className=" text-sm">
                  {nurse.experience_years} yrs
                </TableCell>
                <TableCell className="text-sm font-normal">
                  <div className="flex items-center">
                    <MapPin className="w-4 mr-1" />
                    {nurse.location}
                  </div>
                </TableCell>
                <TableCell className=" text-sm">
                  {nurse.distance_miles.toFixed(1)} mi
                </TableCell>
                <TableCell className="text-center">
                  <div
                    className="text-sm font-normal px-5 py-1.5 rounded-full bg-brand-green2 text-brand-green3"
                  >
                    {nurse.match_score}%
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      nurse.availability_status === "Available"
                        ? "default"
                        : "secondary"
                    }
                    className={`text-xs font-normal px-2 py-1.5 bg-brand-green4 rounded-full shadow-none ${
                      nurse.availability_status === "Available"
                        ? "bg-green-100 text-brand-green5 hover:bg-green-200"
                        : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    }`}
                  >
                    {nurse.availability_status}
                  </Badge>
                </TableCell>

                <TableCell className="text-right text-sm ">
                  <div className="flex items-center">
                    <Star className="w-4 mr-1 text-yellow-400 fill-yellow-400" />{" "}
                    {nurse.previous_rating}
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <Button
                    size="sm"
                    onClick={() => handleDeploy(nurse)}
                    className="px-4 py-1.5 text-sm font-normal rounded-full border text-brand-green6 border-brand-green6 bg-white shadow-none hover:bg-green-50 hover:text-green-800"
                  >
                    Deploy
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredAndSortedNurses.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          No nurses found matching your filters.
        </div>
      )}

      {/* Pagination */}
      {filteredAndSortedNurses.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-b-lg border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-[70px] h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
             <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedNurses.length)} of {filteredAndSortedNurses.length} records
          </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {getPageNumbers().map((page, index) => (
              typeof page === "number" ? (
                <Button
                  key={index}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={`h-8 w-8 p-0 text-sm ${
                    currentPage === page
                      ? "bg-gray-600 text-white hover:bg-cyan-700"
                      : "text-brand-green6"
                  }`}
                >
                  {page}
                </Button>
              ) : (
                <span key={index} className="px-2 text-gray-400">...</span>
              )
            ))}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
         
        </div>
      )}

      {checkedNurses.length > 0 && (
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border">
          <h3 className="font-semibold mb-3 text-slate-900">
            Selected Nurses ({checkedNurses.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {checkedNurses.map((nurse) => (
              <div
                key={nurse.id}
                className="p-3 bg-white border rounded-lg text-sm"
              >
                <div className="font-medium text-slate-900">{nurse.name}</div>
                <div className="text-slate-600">{nurse.specialty}</div>
                <div className="text-slate-500 text-xs mt-1">
                  {nurse.credentials} • ${nurse.rate_per_hour}/hr
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <NurseDetailDialog
        nurse={selectedNurse}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onDeploy={handleDeploy}
      />

      <DeploymentDialog
        nurses={deployingNurses}
        open={isDeploymentOpen}
        onOpenChange={handleDeploymentComplete}
      />
    </div>
  );
}
