import * as React from 'react';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function AttendancReport() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://lms.fardindev.me/attendance/${selectedClass}/${selectedSection}/${selectedMonth}`);
        const data = await response.json();
        setAttendanceData(data.report);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (selectedClass && selectedSection && selectedMonth) {
      fetchData();
    }
  }, [selectedClass, selectedSection, selectedMonth]);

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  const handleSectionChange = (event) => {
    setSelectedSection(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <>
 <FormControl sx={{ m: 1, minWidth: 120 }}>
  <InputLabel id="class-label">Class</InputLabel>
  <Select
    labelId="class-label"
    id="class-select"
    value={selectedClass}
    label="Class"
    onChange={handleClassChange}
  >
    {Array.from({ length: 10 }, (_, index) => (
      <MenuItem key={index} value={index + 1}>{index + 1}</MenuItem>
    ))}
  </Select>
</FormControl>

      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="section-label">Section</InputLabel>
        <Select
          labelId="section-label"
          id="section-select"
          value={selectedSection}
          label="Section"
          onChange={handleSectionChange}
        >
          <MenuItem value={'none'}>None</MenuItem>
          <MenuItem value={'A'}>A</MenuItem>
          <MenuItem value={'B'}>B</MenuItem>
          <MenuItem value={'C'}>C</MenuItem>
          <MenuItem value={'D'}>D</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
  <InputLabel id="month-label">Month</InputLabel>
  <Select
    labelId="month-label"
    id="month-select"
    value={selectedMonth}
    label="Month"
    onChange={handleMonthChange}
  >
    {/* Dynamically generate months */}
    {Array.from({ length: 12 }, (_, index) => {
      const date = new Date();
      date.setMonth(index);
      return (
        <MenuItem key={index} value={`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`}>
          {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date)}
        </MenuItem>
      );
    })}
  </Select>
</FormControl>

      <TableContainer component={Paper}>
        <Table sx={{ maxWidth: 600, margin: 'auto', marginTop: 10 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Roll No</StyledTableCell>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="right">Present (in days)</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {attendanceData && Object.entries(attendanceData).map(([rollNo, { name, count }]) => (
    <StyledTableRow key={rollNo}>
      <StyledTableCell component="left" scope="row">{rollNo}</StyledTableCell>
      <StyledTableCell align="center">{name}</StyledTableCell>
      <StyledTableCell align="right">{count}</StyledTableCell>
    </StyledTableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>
    </>
  );
}
