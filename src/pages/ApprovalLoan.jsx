// src/pages/ApprovalWorkflow.jsx
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
} from "@mui/material";

export default function ApprovalWorkflow() {
    const [loans, setLoans] = useState([]);

    useEffect(() => {
        const members = JSON.parse(localStorage.getItem("members") || "[]");

        // Flatten loans from members
        const allLoans = members.flatMap((m) =>
            (m.loans || []).map((loan) => ({
                ...loan,
                memberId: m.memberId,
                memberName: m.name,
            }))
        );

        setLoans(allLoans);
    }, []);

    const handleApprove = (loanId) => {
        const updatedLoans = loans.map((l) =>
            l.loanId === loanId ? { ...l, status: "approved" } : l
        );
        setLoans(updatedLoans);

        // sync back to members in localStorage
        const members = JSON.parse(localStorage.getItem("members") || "[]");
        const updatedMembers = members.map((m) => ({
            ...m,
            loans: (m.loans || []).map((loan) =>
                loan.loanId === loanId ? { ...loan, status: "approved" } : loan
            ),
        }));
        localStorage.setItem("members", JSON.stringify(updatedMembers));
    };

    const handleReject = (loanId) => {
        const updatedLoans = loans.map((l) =>
            l.loanId === loanId ? { ...l, status: "rejected" } : l
        );
        setLoans(updatedLoans);

        // sync back to members in localStorage
        const members = JSON.parse(localStorage.getItem("members") || "[]");
        const updatedMembers = members.map((m) => ({
            ...m,
            loans: (m.loans || []).map((loan) =>
                loan.loanId === loanId ? { ...loan, status: "rejected" } : loan
            ),
        }));
        localStorage.setItem("members", JSON.stringify(updatedMembers));
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Loan Approval Workflow
                </Typography>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Loan ID</TableCell>
                            <TableCell>Member ID</TableCell>
                            <TableCell>Product</TableCell>
                            <TableCell>Principal</TableCell>
                            <TableCell>Interest (%)</TableCell>
                            <TableCell>Tenure (Months)</TableCell>
                            <TableCell>EMI</TableCell>
                            <TableCell>Total Payable</TableCell>
                            <TableCell>Status</TableCell>

                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loans.map((loan) => (
                            <TableRow key={loan.id}>
                                <TableCell>{loan.loanId}</TableCell>
                                <TableCell>{loan.memberId}</TableCell>
                                <TableCell>{loan.product}</TableCell>
                                <TableCell>{loan.principal}</TableCell>
                                <TableCell>{loan.interest}</TableCell>
                                <TableCell>{loan.tenureMonths}</TableCell>
                                <TableCell>{loan.emi}</TableCell>
                                <TableCell>{loan.totalPayable}</TableCell>

                                <TableCell>{loan.status}</TableCell>
                                <TableCell>
                                    {loan.status === "pending" && (
                                        <Box sx={{ display: "flex", gap: 1 }}>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={() => handleApprove(loan.loanId)}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleReject(loan.loanId)}
                                            >
                                                Reject
                                            </Button>
                                        </Box>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
}
