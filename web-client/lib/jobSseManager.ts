import { jobStatus } from "@/constants/backend_routes"

type JobMessage = (data: any) => void
type JobError = () => void

interface JobConnection {
  eventSource: EventSource
  messageListeners: Set<JobMessage>
  errorListeners: Set<JobError>
}

const jobConnections = new Map<string, JobConnection>()

const ensureJobConnection = (jobId: string) => {
  const existing = jobConnections.get(jobId)
  if (existing) {
    return existing
  }

  const eventSource = new EventSource(`${jobStatus}/${jobId}`)
  const connection: JobConnection = {
    eventSource,
    messageListeners: new Set(),
    errorListeners: new Set(),
  }

  eventSource.onmessage = (event) => {
    let parsed: any = null
    try {
      parsed = JSON.parse(event.data)
    } catch {
      parsed = null
    }

    if (!parsed) {
      return
    }

    connection.messageListeners.forEach((listener) => listener(parsed))
  }

  eventSource.onerror = () => {
    connection.errorListeners.forEach((listener) => listener())
  }

  jobConnections.set(jobId, connection)
  return connection
}

const closeIfUnused = (jobId: string) => {
  const connection = jobConnections.get(jobId)
  if (!connection) {
    return
  }

  if (connection.messageListeners.size === 0 && connection.errorListeners.size === 0) {
    connection.eventSource.close()
    jobConnections.delete(jobId)
  }
}

export const subscribeJobSse = (
  jobId: string,
  handlers: {
    onMessage?: JobMessage
    onError?: JobError
  }
) => {
  const connection = ensureJobConnection(jobId)

  if (handlers.onMessage) {
    connection.messageListeners.add(handlers.onMessage)
  }
  if (handlers.onError) {
    connection.errorListeners.add(handlers.onError)
  }

  return () => {
    if (handlers.onMessage) {
      connection.messageListeners.delete(handlers.onMessage)
    }
    if (handlers.onError) {
      connection.errorListeners.delete(handlers.onError)
    }
    closeIfUnused(jobId)
  }
}

export const isJobSseConnected = (jobId: string) => {
  return jobConnections.has(jobId)
}

export const closeJobSse = (jobId: string) => {
  const connection = jobConnections.get(jobId)
  if (!connection) {
    return
  }
  connection.eventSource.close()
  jobConnections.delete(jobId)
}
