import React, { useState } from 'react';
import axios from 'axios';
import {
    Container,
    TextField,
    Button,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    ListItemText,
    OutlinedInput,
    Box,
} from '@mui/material';

const App = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [isValidJson, setIsValidJson] = useState(true);
    const [response, setResponse] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [error, setError] = useState(null);

    const handleJsonChange = (e) => {
        setJsonInput(e.target.value);
    };

    const validateJson = (input) => {
        try {
            JSON.parse(input);
            return true;
        } catch (e) {
            return false;
        }
    };

    const handleSubmit = async () => {
        if (validateJson(jsonInput)) {
            setIsValidJson(true);
            setError(null);
            try {
                const { data } = await axios.post('https://bajaj-finserv-backend-626b.onrender.com/bfhl', JSON.parse(jsonInput));
                setResponse(data);
            } catch (error) {
                console.error('Error calling API:', error);
                setError('Failed to fetch data from the API');
            }
        } else {
            setIsValidJson(false);
        }
    };

    const handleFilterChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedFilters(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const renderFilteredResponse = () => {
        if (!response) return null;

        const { numbers, alphabets, highest_alphabet } = response;
        return (
            <Box mt={2}>
                {selectedFilters.includes('Numbers') && <Typography>Numbers: {numbers.join(', ')}</Typography>}
                {selectedFilters.includes('Alphabets') && <Typography>Alphabets: {alphabets.join(', ')}</Typography>}
                {selectedFilters.includes('Highest alphabet') && <Typography>Highest Alphabet: {highest_alphabet.join(', ')}</Typography>}
            </Box>
        );
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Maddi Koushik - AP21110010582
            </Typography>
            <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                label="Enter JSON here"
                value={jsonInput}
                onChange={handleJsonChange}
                error={!isValidJson}
                helperText={!isValidJson ? 'Invalid JSON' : ''}
            />
            <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Submit
                </Button>
            </Box>
            {error && <Typography color="error">{error}</Typography>}
            {response && (
                <Box mt={2}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Filter</InputLabel>
                        <Select
                            multiple
                            value={selectedFilters}
                            onChange={handleFilterChange}
                            input={<OutlinedInput label="Filter" />}
                            renderValue={(selected) => selected.join(', ')}
                        >
                            <MenuItem value="Numbers">
                                <Checkbox checked={selectedFilters.includes('Numbers')} />
                                <ListItemText primary="Numbers" />
                            </MenuItem>
                            <MenuItem value="Alphabets">
                                <Checkbox checked={selectedFilters.includes('Alphabets')} />
                                <ListItemText primary="Alphabets" />
                            </MenuItem>
                            <MenuItem value="Highest alphabet">
                                <Checkbox checked={selectedFilters.includes('Highest alphabet')} />
                                <ListItemText primary="Highest alphabet" />
                            </MenuItem>
                        </Select>
                    </FormControl>
                    {renderFilteredResponse()}
                </Box>
            )}
        </Container>
    );
};

export default App;
