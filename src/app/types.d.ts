interface Advocate {
    firstName: string;
    lastName: string;
    city: string;
    degree: string;
    specialties: string[];
    yearsOfExperience: number;
    phoneNumber: number;
}

interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalCount: number;
}