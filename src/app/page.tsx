"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import debounce from 'lodash/debounce';

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAdvocates = useCallback(async (page: number = 1, search: string = "") => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/advocates?page=${page}&limit=10&search=${search}`);
      const { data, currentPage, totalPages, totalCount } = await response.json();
      setAdvocates(data);
      setPaginationInfo({ currentPage, totalPages, totalCount });
    } catch (error) {
      console.error("Error fetching advocates:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((search: string) => {
        fetchAdvocates(1, search);
      }, 500),
    [fetchAdvocates]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    // Cleanup function to cancel the debounce on unmount
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    fetchAdvocates(newPage, searchTerm);
  };

  return (
    <main className="m-6">
      <h1 className="text-2xl font-bold mb-4">Solace Advocates</h1>
      
      <div className="mb-4">
        <input
          className="border border-gray-300 rounded px-2 py-1 mr-2"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search advocates..."
        />
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">First Name</th>
                <th className="border p-2">Last Name</th>
                <th className="border p-2">City</th>
                <th className="border p-2">Degree</th>
                <th className="border p-2">Specialties</th>
                <th className="border p-2">Years of Experience</th>
                <th className="border p-2">Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {advocates.map((advocate, index) => (
                <tr key={index}>
                  <td className="border p-2">{advocate.firstName}</td>
                  <td className="border p-2">{advocate.lastName}</td>
                  <td className="border p-2">{advocate.city}</td>
                  <td className="border p-2">{advocate.degree}</td>
                  <td className="border p-2">{advocate.specialties.join(", ")}</td>
                  <td className="border p-2">{advocate.yearsOfExperience}</td>
                  <td className="border p-2">{advocate.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-between items-center">
            <p>
              Showing {(paginationInfo.currentPage - 1) * 10 + 1} to {Math.min(paginationInfo.currentPage * 10, paginationInfo.totalCount)} of {paginationInfo.totalCount} results
            </p>
            <div>
              <button 
                onClick={() => handlePageChange(paginationInfo.currentPage - 1)} 
                disabled={paginationInfo.currentPage === 1}
                className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
              >
                Previous
              </button>
              <button 
                onClick={() => handlePageChange(paginationInfo.currentPage + 1)} 
                disabled={paginationInfo.currentPage === paginationInfo.totalPages}
                className="bg-blue-500 text-white px-4 py-1 rounded"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}