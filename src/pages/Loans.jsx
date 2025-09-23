// src/pages/ApplicationForm.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate

export default function ApplicationForm() {
  const navigate = useNavigate(); // ✅ initialize navigate
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [form, setForm] = useState({
    id: "",
    loanId: "",
    memberId: "",
    product: "",
    principal: "",
    interestPal: "",
    tenureMonths: "",
  });

  useEffect(() => {
    fetch("/src/Member.json")
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .catch((err) => console.error("Error loading members.json:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMemberChange = (e) => {
    const memberId = e.target.value;
    setSelectedMember(memberId);

    const member = members.find((m) => m.memberId === memberId);
    if (member) {
      setForm((f) => ({
        ...f,
        memberId: member.memberId,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const membersData = JSON.parse(localStorage.getItem("members") || "[]");

    // EMI Calculation
    const P = parseFloat(form.principal);
    const annualRate = parseFloat(form.interestPal);
    const N = parseInt(form.tenureMonths, 10);
    const R = annualRate / 12 / 100;
    const emi =
      (P * R * Math.pow(1 + R, N)) /
      (Math.pow(1 + R, N) - 1);

    const newLoan = {
      ...form,
      id: uuidv4(),
      loanId: "LOAN-" + Date.now(),
      status: "pending",
      createdAt: new Date().toISOString(),
      emi: emi.toFixed(2),
      totalPayable: (emi * N).toFixed(2),
      repaymentSchedule: []
    };

    const updatedMembers = membersData.map((m) => {
      if (m.memberId === form.memberId) {
        return {
          ...m,
          loans: [...(m.loans || []), newLoan]
        };
      }
      return m;
    });

    localStorage.setItem("members", JSON.stringify(updatedMembers));
    alert("Loan added for " + form.memberId);

    setForm({
      id: "",
      loanId: "",
      memberId: "",
      product: "",
      principal: "",
      interestPal: "",
      tenureMonths: ""
    });
    setSelectedMember("");

    navigate("/approvalloan");
  };


  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          Loan Application Form
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {/* Member Select */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="member-select-label">Select Member</InputLabel>
            <Select
              labelId="member-select-label"
              value={selectedMember}
              onChange={handleMemberChange}
              required
            >
              {members.map((m) => (
                <MenuItem key={m.memberId} value={m.memberId}>
                  {m.name} ({m.memberId})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Loan Details */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="product-label">Product</InputLabel>
            <Select
              labelId="product-label"
              name="product"
              value={form.product}
              onChange={handleChange}
              required
            >
              <MenuItem value="Personal">Personal</MenuItem>
              <MenuItem value="Home">Home</MenuItem>
              <MenuItem value="Car">Car</MenuItem>
              <MenuItem value="Education">Education</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Principal Amount"
            name="principal"
            type="number"
            value={form.principal}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Interest (%)"
            name="interestPal"
            type="number"
            value={form.interestPal}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Tenure (Months)"
            name="tenureMonths"
            type="number"
            value={form.tenureMonths}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Submit Application
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

