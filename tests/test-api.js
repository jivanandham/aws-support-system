const https = require('https');

// Our API Gateway endpoint - notice we're adding '/tickets' at the end
// because that's the resource path we defined in our API Gateway
const apiEndpoint = 'https://suxj9j5g0c.execute-api.us-east-1.amazonaws.com/development/tickets';

// This is the support ticket we want to create
// Notice how we're structuring the data to match what our Lambda function expects
const ticketData = {
    description: "I need help with my account settings. The save button isn't working.",
    customerEmail: "test@example.com",
    // Adding some optional fields to make our ticket more informative
    priority: "medium",
    category: "account-settings"
};

// We'll parse the URL to get the parts we need for the request
const url = new URL(apiEndpoint);

// Set up our request options with detailed headers
const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        // Making sure we specify the content length
        'Content-Length': Buffer.byteLength(JSON.stringify(ticketData)),
        // Adding headers that might be helpful for debugging
        'User-Agent': 'Support-System-Test-Script/1.0'
    }
};

console.log('Starting support ticket creation test...');
console.log('Endpoint:', apiEndpoint);
console.log('Sending ticket data:', JSON.stringify(ticketData, null, 2));

// Create our HTTPS request
const req = https.request(options, (res) => {
    // This will store our response body as it comes in
    let responseBody = '';
    
    console.log('\nResponse Status:', res.statusCode);
    console.log('Response Headers:', JSON.stringify(res.headers, null, 2));

    // Collect the response data as it streams in
    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    // When we have the complete response
    res.on('end', () => {
        console.log('\nComplete Response Body:');
        try {
            // Try to parse the response as JSON
            const parsedResponse = JSON.parse(responseBody);
            console.log(JSON.stringify(parsedResponse, null, 2));
            
            // If we got a ticketId back, our system is working!
            if (parsedResponse.ticketId) {
                console.log('\nSuccess! Ticket created with ID:', parsedResponse.ticketId);
            }
        } catch (e) {
            // If it's not JSON, just show the raw response
            console.log('Raw response:', responseBody);
        }
    });
});

// Handle any errors that occur during the request
req.on('error', (error) => {
    console.error('\nError making request:');
    console.error('Error message:', error.message);
    console.error('Full error:', error);
});

// Send our ticket data
req.write(JSON.stringify(ticketData));
req.end();

console.log('\nRequest sent, waiting for response...');
