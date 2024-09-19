"use client";

import { useEffect, useState, useCallback } from "react";

export default function Home() {
  // State to store all advocates
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  // State to store filtered advocates based on search
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  // State to store the current search term
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch advocates data when component mounts
  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        const response = await fetch("/api/advocates");
        const { data } = await response.json();
        setAdvocates(data);
        setFilteredAdvocates(data);
      } catch (error) {
        console.error("Error fetching advocates:", error);
      }
    };

    fetchAdvocates();
  }, []);

  // Memoized function to filter advocates based on search term
  const filterAdvocates = useCallback((term: string) => {
    return advocates.filter((advocate) =>
      // Check if any property of the advocate includes the search term
      Object.values(advocate).some((value) =>
        value.toString().toLowerCase().includes(term.toLowerCase())
      )
    );
  }, [advocates]);

  // Handle search input changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredAdvocates(filterAdvocates(term));
  };

  // Reset search to show all advocates
  const resetSearch = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  return (
    <main className="m-6">
      <h1 className="text-2xl font-bold mb-4">Solace Advocates</h1>
      
      {/* Search section */}
      <div className="mb-4">
        <p>Search</p>
        <p>Searching for: <span>{searchTerm}</span></p>
        <input
          className="border border-gray-300 rounded px-2 py-1 mr-2"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search advocates..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded"
          onClick={resetSearch}
        >
          Reset Search
        </button>
      </div>

      {/* Advocates table */}
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
          {/* Map through filtered advocates and render each row */}
          {filteredAdvocates.map((advocate, index) => (
            <tr key={index}>
              <td className="border p-2">{advocate.firstName}</td>
              <td className="border p-2">{advocate.lastName}</td>
              <td className="border p-2">{advocate.city}</td>
              <td className="border p-2">{advocate.degree}</td>
              <td className="border p-2">
                {advocate.specialties.join(", ")}
              </td>
              <td className="border p-2">{advocate.yearsOfExperience}</td>
              <td className="border p-2">{advocate.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}