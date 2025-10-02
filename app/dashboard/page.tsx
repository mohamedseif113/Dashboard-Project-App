"use client";

import { useState, useMemo } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardHeader } from "@/components/dashboard-header";
import { ProjectFilters } from "@/components/project-filters";
import { ProjectsTable } from "@/components/projects-table";
import { Pagination } from "@/components/pagination";
import { ActivityFeed } from "@/components/activity-feed";
import { Button } from "@/components/ui/button";
import { Plus, BarChart3 } from "lucide-react";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import type { Project, ProjectStatus } from "@/lib/types";
import { useWebSocket } from "@/hooks/use-websocket";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "All">(
    "All"
  );
  const [sortField, setSortField] = useState<keyof Project>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { sendMessage } = useWebSocket((message) => {
    if (message.type === "project_update" && message.payload.id) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === message.payload.id ? { ...p, ...message.payload.updates } : p
        )
      );
    }
  });

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    const filtered = projects.filter((project) => {
      const matchesSearch = project.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return filtered;
  }, [projects, searchQuery, statusFilter, sortField, sortDirection]);

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedProjects.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedProjects, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedProjects.length / pageSize);

  const handleSort = (field: keyof Project) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleUpdateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? {
              ...project,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : project
      )
    );

    sendMessage({
      type: "project_update",
      payload: { id, updates },
    });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className=" py-8">
          <div className="container mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
                <p className="text-muted-foreground">
                  Manage and track all your projects
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard/analytics")}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <ProjectFilters
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                />

                <ProjectsTable
                  projects={paginatedProjects}
                  onSort={handleSort}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onUpdateProject={handleUpdateProject}
                />

                {filteredAndSortedProjects.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={filteredAndSortedProjects.length}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={handlePageSizeChange}
                  />
                )}
              </div>

              <div className="lg:col-span-1">
                <ActivityFeed />
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
