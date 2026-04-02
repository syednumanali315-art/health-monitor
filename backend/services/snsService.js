const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const snsClient = new SNSClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

const sendEmergencyAlert = async (message, patientName, patientMobile, doctorMobile) => {
  if (!process.env.SNS_TOPIC_ARN) {
    console.log('[SNS Simulator] Emergency Alert:', message, '| Patient:', patientName);
    return;
  }

  const alertMessage = `🚨 HEALTH EMERGENCY: ${patientName}\nDetails: ${message}\nContact Patient: ${patientMobile||'N/A'}`;

  try {
    const data = await snsClient.send(new PublishCommand({
      TopicArn: process.env.SNS_TOPIC_ARN,
      Message: alertMessage,
      Subject: "CRITICAL: Health Emergency Alert"
    }));
    console.log("SNS Alert Sent Successfully", data.MessageId);
    return data;
  } catch (err) {
    console.error("SNS Error:", err);
    throw err;
  }
};

module.exports = {
  sendEmergencyAlert
};
