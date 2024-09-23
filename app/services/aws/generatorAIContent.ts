import { json } from "@remix-run/node"
import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn"

const generatorAIContent = async (
  event_type: string,
  submission: any,
  sessionid: any
) => {
  if (
    !process.env.REACT_APP_AWS_ACCESS_KEY_ID ||
    !process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
  ) {
    throw new Error("AWS access key ID and secret access key are required")
  }

  const client = new SFNClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    },
  })

  const command = new StartExecutionCommand({
    stateMachineArn: process.env.REACT_APP_AWS_SFN_ARN,
    input: JSON.stringify({
      event_type: event_type,
      timestamp: Date.now().toString(),
      data: submission.value,
    }),
  })

  console.log("iniciando a execução da Step Function")
  try {
    const data = await client.send(command)
    const response = { ...submission, executionArn: data.executionArn }

    console.log("Resultado da execução da Step Function:", response)
    return json(response)
  } catch (error: any) {
    console.error("Erro ao iniciar a execução da Step Function:", error)
    return json({ ...submission, error: error.message }, { status: 500 })
  }
}

export default generatorAIContent
