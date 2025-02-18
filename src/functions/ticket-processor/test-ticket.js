const https = require('https');

// Replace this with your actual API endpoint from CloudFormation
const apiEndpoint = 'https://suxj9j5g0c.execute-api.us-east-1.amazonaws.com/development';

// Test ticket data
const ticketData = {
    description: "I'm having trouble logging into my account. The system keeps saying 'invalid credentials' even though I'm sure my password is correct.",
    customerEmail: "test@example.com"
};

// Prepare the request options
const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    }
};

// Create the request
const req = https.request(apiEndpoint, options, (res) => {
    let data = '';

    // Collect the response data
    res.on('data', (chunk) => {
        data += chunk;
    });

    // Process the complete response
    res.on('end', () => {
        console.log('Response Status:', res.statusCode);
        console.log('Response Headers:', res.headers);
        console.log('Response Body:', JSON.parse(data));
    });
});

// Handle any errors
req.on('error', (error) => {
    console.error('Error sending request:', error);
});

// Send the ticket data
req.write(JSON.stringify(ticketData));
req.end();

console.log('Sending test support ticket...');
