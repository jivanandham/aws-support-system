const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

// Initialize DynamoDB client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

async function checkTickets() {
    try {
        // Get the table name from environment or use default
        const tableName = process.env.TICKETS_TABLE || 'development-support-tickets';

        // Scan the tickets table
        const command = new ScanCommand({
            TableName: tableName,
            Limit: 10 // Limit to last 10 tickets for brevity
        });

        const response = await docClient.send(command);

        console.log('Recent Support Tickets:');
        console.log('======================');
        
        response.Items.forEach(ticket => {
            console.log(`\nTicket ID: ${ticket.ticketId}`);
            console.log(`Status: ${ticket.status}`);
            console.log(`Priority: ${ticket.priority}`);
            console.log(`Created At: ${ticket.createdAt}`);
            console.log(`Customer Email: ${ticket.customerEmail}`);
            console.log(`Sentiment: ${ticket.sentiment}`);
            console.log('-----------------------');
        });

    } catch (error) {
        console.error('Error checking tickets:', error);
    }
}

// Run the check
checkTickets();
