import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ICellRendererParams, ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
import { Users, DollarSign, Award, TrendingUp } from "lucide-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./dashboard.css";
import { employees } from "../data/employee";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  performanceRating: number;
  projectsCompleted: number;
  isActive: boolean;
}

/* for employee dashboard */
const EmployeeDashboard = () => {
  const stats = useMemo(() => {
    const activeEmployees = employees.filter((e) => e.isActive).length;
    const avgSalary =
      employees.reduce((s, e) => s + e.salary, 0) / employees.length;
    const avgRating =
      employees.reduce((s, e) => s + e.performanceRating, 0) / employees.length;
    const totalProjects = employees.reduce(
      (s, e) => s + e.projectsCompleted,
      0
    );

    return {
      activeEmployees,
      avgSalary: Math.round(avgSalary),
      avgRating: avgRating.toFixed(1),
      totalProjects,
    };
  }, []);

  /* employee data columns */
  const columnDefs = useMemo<ColDef<Employee>[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        width: 80,
        cellStyle: { color: "#2563eb", fontWeight: 600 },
      },
      {
        headerName: "Name",
        valueGetter: (p) => `${p.data?.firstName} ${p.data?.lastName}`,
        cellRenderer: (p: ICellRendererParams<Employee>) => (
          <div>
            <div className="name">{p.value}</div>
            <div className="email">{p.data?.email}</div>
          </div>
        ),
      },
      {
        field: "department",
        cellRenderer: (p: ICellRendererParams<Employee, string>) => (
          <span className="dept-pill">{p.value}</span>
        ),
      },
      { field: "position" },
      {
        field: "salary",
        headerName: "Salary",
        valueFormatter: (p) => `$${p.value.toLocaleString()}`,
        cellStyle: { color: "#16a34a", fontWeight: 600 },
      },
      {
        field: "performanceRating",
        headerName: "Rating",
        cellRenderer: (p: ICellRendererParams<Employee, number>) => (
          <div>
            <div className="stars">{"⭐".repeat(Math.round(p.value ?? 0))}</div>
            <div className="rating">{p.value}</div>
          </div>
        ),
      },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: true,
      flex: 1,
      resizable: true,
    }),
    []
  );

  return (
    <div className="dashboard">
      <h1>Employee Management Dashboard</h1>
      <p className="subtitle">Manage and track your team performance</p>

      {/* employee average cards */}
      <div className="stats-grid">
        <StatCard
          title="Active Employees"
          value={stats.activeEmployees}
          icon={<Users />}
          color="blue"
        />
        <StatCard
          title="Avg Salary"
          value={`$${(stats.avgSalary / 1000).toFixed(0)}K`}
          icon={<DollarSign />}
          color="green"
        />
        <StatCard
          title="Avg Rating"
          value={`${stats.avgRating} ⭐`}
          icon={<Award />}
          color="yellow"
        />
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={<TrendingUp />}
          color="purple"
        />
      </div>

      {/* pass employee data to ag grid */}
      <div className="table-card">
        <div className="ag-theme-alpine modern-grid">
          <AgGridReact<Employee>
            rowData={employees}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination
            paginationPageSize={10}
            animateRows
            rowHeight={56}
            headerHeight={48}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

/* employee average static */
const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "blue" | "green" | "yellow" | "purple";
}) => (
  <div className="stat-card">
    <div>
      <p className="stat-title">{title}</p>
      <p className="stat-value">{value}</p>
    </div>
    <div className={`icon-box ${color}`}>{icon}</div>
  </div>
);
