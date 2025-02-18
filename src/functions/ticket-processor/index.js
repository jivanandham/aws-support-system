const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { ComprehendClient, DetectSentimentCommand } = require('@aws-sdk/client-comprehend');

// Initialize AWS clients
const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const comprehendClient = new ComprehendClient({});

exports.handler = async (event) => {
    console.log('Processing support ticket request:', JSON.stringify(event, null, 2));
    
    try {
        // Parse incoming request
        const body = JSON.parse(event.body);
        
        // Validate required fields
        if (!body.description || !body.customerEmail) {
            return formatResponse(400, {
                message: 'Required fields missing: description and customerEmail are required'
            });
        }

        // Generate unique ticket ID and timestamp
        const ticketId = `TICKET-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const timestamp = new Date().toISOString();

        // Analyze ticket sentiment
        const sentimentResult = await analyzeSentiment(body.description);
        console.log('Sentiment analysis result:', sentimentResult);

        // Determine ticket priority based on sentiment
        const priority = determinePriority(sentimentResult);

        // Create ticket record
        const ticket = {
            ticketId,
            status: 'NEW',
            priority,
            description: body.description,
            customerEmail: body.customerEmail,
            sentiment: sentimentResult.Sentiment,
            sentimentScore: sentimentResult.SentimentScore,
            createdAt: timestamp,
            updatedAt: timestamp,
            environment: process.env.Environment || 'development'
        };

        // Store ticket in DynamoDB
        await storeTicket(ticket);
        console.log('Ticket stored successfully:', ticketId);

        return formatResponse(200, {
            message: 'Support ticket created successfully',
            ticketId,
            priority,
            status: 'NEW'
        });

    } catch (error) {
        console.error('Error processing support ticket:', error);
        return formatResponse(500, {
            message: 'Internal server error while processing support ticket'
        });
    }
};

async function analyzeSentiment(text) {
    const command = new DetectSentimentCommand({
        Text: text,
        LanguageCode: 'en'
    });

    return await comprehendClient.send(command);
}

function determinePriority(sentimentResult) {
    // Determine priority based on sentiment score
    const sentiment = sentimentResult.Sentiment;
    const score = sentimentResult.SentimentScore;

    if (sentiment === 'NEGATIVE' && score.Negative > 0.7) {
        return 'HIGH';
    } else if (sentiment === 'NEGATIVE' || sentiment === 'MIXED') {
        return 'MEDIUM';
    }
    return 'LOW';
}

async function storeTicket(ticket) {
    const command = new PutCommand({
        TableName: process.env.TICKETS_TABLE,
        Item: ticket
    });

    return await docClient.send(command);
}

function formatResponse(statusCode, body) {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' // Enable CORS
        },
        body: JSON.stringify(body)
    };
}
