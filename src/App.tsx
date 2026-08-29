import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import CookieConsent from "@/components/CookieConsent";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { checkAndClearCache } from "@/lib/cacheUtils";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import CandidateSignup from "./pages/CandidateSignup";
import Login from "./pages/Login";
import Plans from "./pages/Plans";
import PaymentCheckout from "./pages/PaymentCheckout";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import NewTicket from "./pages/NewTicket";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Refunds from "./pages/Refunds";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import AdminTicketsList from "./pages/AdminTicketsList";
import AdminUsers from "./pages/AdminUsers";
import AdminAuditLogs from "./pages/AdminAuditLogs";
import AdminReports from "./pages/AdminReports";
import AdminPlanRequests from "./pages/AdminPlanRequests";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AnalystDashboard from "./pages/AnalystDashboard";
import AnalystTickets from "./pages/AnalystTickets";
import AnalystTicketDetail from "./pages/AnalystTicketDetail";
import AnalystCandidateApplications from "./pages/AnalystCandidateApplications";
import AnalystChat from "./pages/AnalystChat";
import AnalystProfile from "./pages/AnalystProfile";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import RecruiterChat from "./pages/RecruiterChat";
import RecruiterCandidatePool from "./pages/RecruiterCandidatePool";
import EmployerDashboard from "./pages/EmployerDashboard";
import EmployerChat from "./pages/EmployerChat";
import CandidateDashboard from "./pages/CandidateDashboard";
import CandidateProfile from "./pages/CandidateProfile";
import TicketDetail from "./pages/TicketDetail";
import TicketRevision from "./pages/TicketRevision";
import RecruiterTicketDetail from "./pages/RecruiterTicketDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const roles = {
  admin: ['super_admin'], analyst: ['analyst'], recruiter: ['recruiter'], employer: ['employer'], candidate: ['candidate']
};

const App = () => {
  useEffect(() => { checkAndClearCache(); }, []);
  return <QueryClientProvider client={queryClient}>
    <Analytics /><TooltipProvider><Toaster /><Sonner /><CookieConsent />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Home />} /><Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} /><Route path="/services" element={<Services />} />
          <Route path="/terms" element={<Terms />} /><Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/refunds" element={<Refunds />} /><Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} /><Route path="/candidate" element={<CandidateSignup />} />
          <Route path="/login" element={<Login />} /><Route path="/plans" element={<Plans />} />
          <Route path="/payment/checkout" element={<PaymentCheckout />} /><Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['super_admin','analyst','recruiter','employer','candidate']}><Dashboard /></ProtectedRoute>} />
          <Route path="/new-ticket" element={<ProtectedRoute allowedRoles={roles.employer}><NewTicket /></ProtectedRoute>} />
          <Route path="/tickets/:id" element={<ProtectedRoute allowedRoles={roles.employer}><TicketDetail /></ProtectedRoute>} />
          <Route path="/tickets/:ticketId/revision" element={<ProtectedRoute allowedRoles={roles.employer}><TicketRevision /></ProtectedRoute>} />
          <Route path="/superadmin" element={<ProtectedRoute allowedRoles={roles.admin}><SuperAdminDashboard /></ProtectedRoute>} />
          <Route path="/superadmin/dashboard" element={<ProtectedRoute allowedRoles={roles.admin}><SuperAdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={roles.admin}><SuperAdminDashboard /></ProtectedRoute>} />
          <Route path="/superadmin/tickets" element={<ProtectedRoute allowedRoles={roles.admin}><AdminTicketsList /></ProtectedRoute>} />
          <Route path="/superadmin/tickets/:id" element={<ProtectedRoute allowedRoles={roles.admin}><AnalystTicketDetail /></ProtectedRoute>} />
          <Route path="/admin/users/:id" element={<ProtectedRoute allowedRoles={roles.admin}><AdminUsers /></ProtectedRoute>} />
          <Route path="/superadmin/users" element={<ProtectedRoute allowedRoles={roles.admin}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/plan-requests" element={<ProtectedRoute allowedRoles={roles.admin}><AdminPlanRequests /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={roles.admin}><AdminAuditLogs /></ProtectedRoute>} />
          <Route path="/admin/audit-logs" element={<ProtectedRoute allowedRoles={roles.admin}><AdminAuditLogs /></ProtectedRoute>} />
          <Route path="/superadmin/analytics" element={<ProtectedRoute allowedRoles={roles.admin}><AdminReports /></ProtectedRoute>} />
          <Route path="/analyst/dashboard" element={<ProtectedRoute allowedRoles={roles.analyst}><AnalystDashboard /></ProtectedRoute>} />
          <Route path="/analyst/tickets" element={<ProtectedRoute allowedRoles={roles.analyst}><AnalystTickets /></ProtectedRoute>} />
          <Route path="/analyst/tickets/:id" element={<ProtectedRoute allowedRoles={roles.analyst}><AnalystTicketDetail /></ProtectedRoute>} />
          <Route path="/analyst/candidate-applications" element={<ProtectedRoute allowedRoles={roles.analyst}><AnalystCandidateApplications /></ProtectedRoute>} />
          <Route path="/analyst/chat" element={<ProtectedRoute allowedRoles={roles.analyst}><AnalystChat /></ProtectedRoute>} />
          <Route path="/analyst/profile" element={<ProtectedRoute allowedRoles={roles.analyst}><AnalystProfile /></ProtectedRoute>} />
          <Route path="/recruiter/dashboard" element={<ProtectedRoute allowedRoles={roles.recruiter}><RecruiterDashboard /></ProtectedRoute>} />
          <Route path="/recruiter/chat" element={<ProtectedRoute allowedRoles={roles.recruiter}><RecruiterChat /></ProtectedRoute>} />
          <Route path="/recruiter/candidate-pool" element={<ProtectedRoute allowedRoles={roles.recruiter}><RecruiterCandidatePool /></ProtectedRoute>} />
          <Route path="/recruiter/tickets/:id" element={<ProtectedRoute allowedRoles={roles.recruiter}><RecruiterTicketDetail /></ProtectedRoute>} />
          <Route path="/employer/dashboard" element={<ProtectedRoute allowedRoles={roles.employer}><EmployerDashboard /></ProtectedRoute>} />
          <Route path="/employer/chat" element={<ProtectedRoute allowedRoles={roles.employer}><EmployerChat /></ProtectedRoute>} />
          <Route path="/employer/chat/:ticketId" element={<ProtectedRoute allowedRoles={roles.employer}><EmployerChat /></ProtectedRoute>} />
          <Route path="/candidate/dashboard" element={<ProtectedRoute allowedRoles={roles.candidate}><CandidateDashboard /></ProtectedRoute>} />
          <Route path="/candidate/profile" element={<ProtectedRoute allowedRoles={roles.candidate}><CandidateProfile /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>;
};
export default App;
