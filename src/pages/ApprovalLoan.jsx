import React, { useState, useEffect } from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

export default function ApprovalWorkflow() {
    const [loans, setLoans] = useState([]);

    useEffect(() => {
        const members = JSON.parse(localStorage.getItem("members") || "[]");

        const allLoans = members.flatMap((m) =>
            (m.loans || []).map((loan) => ({
                ...loan,
                memberId: m.memberId,
                memberName: m.name,
            }))
        );

        setLoans(allLoans);
    }, []);

    const updateLoanStatus = (loanId, status) => {
        const updatedLoans = loans.map((l) =>
            l.loanId === loanId ? { ...l, status } : l
        );
        setLoans(updatedLoans);

        const members = JSON.parse(localStorage.getItem("members") || "[]");
        const updatedMembers = members.map((m) => ({
            ...m,
            loans: (m.loans || []).map((loan) =>
                loan.loanId === loanId ? { ...loan, status } : loan
            ),
        }));
        localStorage.setItem("members", JSON.stringify(updatedMembers));
    };

    const handleApprove = (loanId) => updateLoanStatus(loanId, "approved");
    const handleReject = (loanId) => updateLoanStatus(loanId, "rejected");

    const getStatusChip = (status) => {
        switch (status) {
            case "approved":
                return <Chip icon={<CheckCircleIcon />} label="Approved" color="success" size="small" />;
            case "rejected":
                return <Chip icon={<CancelIcon />} label="Rejected" color="error" size="small" />;
            default:
                return <Chip icon={<PendingActionsIcon />} label="Pending" color="warning" size="small" />;
        }
    };

    const getRowStyle = (status) => {
        switch (status) {
            case "approved":
                return { background: "linear-gradient(90deg, #e8f5e9, #c8e6c9)" };
            case "rejected":
                return { background: "linear-gradient(90deg, #ffebee, #ffcdd2)" };
            default:
                return { background: "linear-gradient(90deg, #fffde7, #fff9c4)" };
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                Loan Approval Workflow
            </Typography>

            <Paper sx={{ p: 1.5, borderRadius: 3, boxShadow: 3 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: "#283593" }}>
                        <TableRow>
                            <TableCell sx={{ color: "white", fontSize: "0.875rem" }}>Loan ID</TableCell>
                            <TableCell sx={{ color: "white", fontSize: "0.875rem" }}>Member</TableCell>
                            <TableCell sx={{ color: "white", fontSize: "0.875rem" }}>Product</TableCell>
                            <TableCell sx={{ color: "white", fontSize: "0.875rem" }}>Principal</TableCell>
                            <TableCell sx={{ color: "white", fontSize: "0.875rem" }}>Interest (%)</TableCell>
                            <TableCell sx={{ color: "white", fontSize: "0.875rem" }}>Tenure</TableCell>
                            <TableCell sx={{ color: "white", fontSize: "0.875rem" }}>EMI</TableCell>
                            <TableCell sx={{ color: "white", fontSize: "0.875rem" }}>Total Payable</TableCell>
                            <TableCell sx={{ color: "white", fontSize: "0.875rem" }}>Status</TableCell>
                            <TableCell sx={{ color: "white", fontSize: "0.875rem" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loans.map((loan) => (
                            <TableRow key={loan.loanId} sx={{ ...getRowStyle(loan.status) }}>
                                <TableCell sx={{ fontSize: "0.85rem" }}>{loan.loanId}</TableCell>
                                <TableCell sx={{ fontSize: "0.85rem" }}>
                                    {loan.memberName} ({loan.memberId})
                                </TableCell>
                                <TableCell sx={{ fontSize: "0.85rem" }}>{loan.product}</TableCell>
                                <TableCell sx={{ fontSize: "0.85rem" }}>₹{loan.principal}</TableCell>
                                <TableCell sx={{ fontSize: "0.85rem" }}>{loan.interest}</TableCell>
                                <TableCell sx={{ fontSize: "0.85rem" }}>{loan.tenureMonths}</TableCell>
                                <TableCell sx={{ fontSize: "0.85rem" }}>₹{loan.emi}</TableCell>
                                <TableCell sx={{ fontSize: "0.85rem" }}>₹{loan.totalPayable}</TableCell>
                                <TableCell>{getStatusChip(loan.status)}</TableCell>
                                <TableCell>
                                    {loan.status === "pending" && (
                                        <Box sx={{ display: "flex", gap: 0.5 }}>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                onClick={() => handleApprove(loan.loanId)}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                onClick={() => handleReject(loan.loanId)}
                                            >
                                                Reject
                                            </Button>
                                        </Box>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}

                        {loans.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={10} align="center" sx={{ fontSize: "0.875rem" }}>
                                    No loan applications found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
}
