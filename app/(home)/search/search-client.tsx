"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import searchFilters from "@/data/search-filters.json";
import { useRouter, useSearchParams } from "next/navigation";

export const SearchClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(true);

  const [filters, setFilters] = useState({
    location: searchParams.get("location") || "100",
    specialization: searchParams.get("specialization") || "icu",
    experience: searchParams.get("experience") || "5+",
    availability: searchParams.get("availability") || "immediate",
  });

  // useEffect(() => {
  //   const params = new URLSearchParams(filters);
  //   router.replace(`/search?${params.toString()}`);
  // }, []);

  const handleSubmit = () => {
    const params = new URLSearchParams(filters);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div
      data-testid="filters-section"
      className="bg-white border border-[#E5E7EB] rounded-lg"
    >
      <div className="flex items-center justify-between px-5 py-4">
        <h3 className="text-lg font-normal">Filters</h3>
        <button
          data-testid="toggle-filters-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 text-sm font-medium text-[#009689] hover:text-[#007A55] transition-colors"
        >
          {/* <Filter className="w-4 h-4" /> */}
          {isOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {isOpen && (
        <>
          <div className="px-5 pb-3 grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-normal mb-1.5">
                Location
              </label>
              <Select
                value={filters.location}
                onValueChange={(value) =>
                  setFilters({ ...filters, location: value })
                }
              >
                <SelectTrigger
                  data-testid="filter-location"
                  className="h-10 bg-white border-[#E5E7EB] text-sm"
                >
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  {searchFilters.location.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-normal mb-1.5">
                Specialty
              </label>
              <Select
                value={filters.specialization}
                onValueChange={(value) =>
                  setFilters({ ...filters, specialization: value })
                }
              >
                <SelectTrigger
                  data-testid="filter-specialty"
                  className="h-10 bg-white border-[#E5E7EB] text-sm"
                >
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  {searchFilters.specialization.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-normal mb-1.5">
                Experience
              </label>
              <Select
                value={filters.experience}
                onValueChange={(value) =>
                  setFilters({ ...filters, experience: value })
                }
              >
                <SelectTrigger
                  data-testid="filter-experience"
                  className="h-10 bg-white border-[#E5E7EB] text-sm"
                >
                  <SelectValue placeholder="All Experience" />
                </SelectTrigger>
                <SelectContent>
                  {searchFilters.experience.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="">
              <label className="block text-sm font-normal mb-1.5">
                Availability
              </label>
              <Select
                value={filters.availability}
                onValueChange={(value) =>
                  setFilters({ ...filters, availability: value })
                }
              >
                <SelectTrigger
                  data-testid="filter-availability"
                  className="h-10 bg-white border-[#E5E7EB] text-sm"
                >
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  {searchFilters.availability.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="px-5 pb-2 flex justify-end">
            <Button
              onClick={handleSubmit}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              Apply Filters
            </Button>
          </div>
          <hr className="mx-5" />
          {/* Results count */}
          <p
            data-testid="results-count"
            className=" px-5 pb-3 text-sm font-normal"
          >
            00 nurses match your criteria
          </p>
        </>
      )}
    </div>
  );
};
