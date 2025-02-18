# AWS Support System

A sophisticated serverless support ticket management system built with AWS services that provides automated ticket processing, sentiment analysis, and scalable storage.

## Overview

This system automates the handling of customer support tickets by leveraging AWS's serverless architecture. When customers submit support requests, the system automatically analyzes the content for sentiment and urgency, stores the ticket information securely, and prepares it for support team review.

## Architecture

Our system integrates several AWS services to create a robust and scalable solution:

### API Gateway
Serves as the system's entry point, providing secure REST endpoints for ticket management. It handles:
- Ticket creation and submission
- Ticket status retrieval
- Ticket updates
- Authentication and authorization

### Lambda Functions
Processes tickets in a serverless environment, performing:
- Content validation and sanitization
- Sentiment analysis integration
- Database operations
- Error handling and logging

### DynamoDB
Provides persistent storage with:
- Consistent single-digit millisecond performance
- Automatic scaling
- Encrypted storage at rest
- Flexible schema design

### AWS Comprehend
Performs natural language processing to:
- Analyze ticket sentiment
- Detect key phrases
- Identify urgent issues
- Categorize support requests

## Project Structure

```
aws-support-system/
├── infrastructure/
│   └── support-system.yaml    # CloudFormation template defining AWS resources
├── src/
│   └── functions/
│       └── ticket-processor/  # Lambda function implementation
│           ├── index.js       # Main Lambda handler
│           ├── package.json   # Dependencies
│           └── test-ticket.js # Unit tests for ticket processing
└── tests/
    ├── test-api.js           # API integration tests
    └── check-tickets.js      # Ticket retrieval tests
```

## Installation and Setup

1. Prerequisites:
   ```bash
   # Install AWS CLI
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install

   # Install Node.js and npm
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. Configure AWS credentials:
   ```bash
   aws configure
   # Enter your AWS Access Key ID
   # Enter your AWS Secret Access Key
   # Enter your default region (e.g., us-east-1)
   ```

## Local Development

1. Install project dependencies:
   ```bash
   cd src/functions/ticket-processor
   npm install
   ```

2. Set up environment variables:
   ```bash
   export AWS_REGION=us-east-1
   export TICKETS_TABLE=support-tickets
   ```

3. Run tests:
   ```bash
   node test-ticket.js
   node tests/test-api.js
   ```

## Deployment

1. Create deployment bucket:
   ```bash
   aws s3 mb s3://jiva-support-system-2025
   ```

2. Package the application:
   ```bash
   aws cloudformation package \
       --template-file infrastructure/support-system.yaml \
       --s3-bucket jiva-support-system-2025 \
       --output-template-file packaged.yaml
   ```

3. Deploy the stack:
   ```bash
   aws cloudformation deploy \
       --template-file packaged.yaml \
       --stack-name support-system \
       --capabilities CAPABILITY_IAM
   ```

4. Verify deployment:
   ```bash
   aws cloudformation describe-stacks \
       --stack-name support-system \
       --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
       --output text
   ```

## Security Considerations

Our system implements several security best practices:

- API Authentication: All endpoints require proper authentication
- Data Encryption: All data is encrypted at rest and in transit
- Least Privilege: IAM roles follow the principle of least privilege
- Input Validation: All user input is validated and sanitized
- Secret Management: Sensitive information is stored in AWS Secrets Manager
- Logging: Comprehensive logging for audit and debugging purposes

## Monitoring and Maintenance

The system includes comprehensive monitoring:

- CloudWatch Logs capture detailed Lambda execution logs
- CloudWatch Metrics track API and Lambda performance
- DynamoDB monitoring provides insights into database performance
- X-Ray distributed tracing helps identify bottlenecks

## Cleanup

To remove all deployed resources:

```bash
# Delete CloudFormation stack
aws cloudformation delete-stack --stack-name support-system

# Delete deployment bucket
aws s3 rm s3://jiva-support-system-2025 --recursive
aws s3 rb s3://jiva-support-system-2025
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.
