const baseUrl = new URL(
  'https://asia-southeast1-summer-music-342809.cloudfunctions.net'
)

async function fetchCommon(path: string, reqData: Record<string, unknown>) {
  const url = new URL(path, baseUrl)
  const request: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: reqData,
    }),
  }

  const response = await fetch(url.href, request)
  return response.json()
}

export async function latestTransmissionCount() {
  return fetchCommon('latestTransmissionCount', {
    locationSlug: 'philippines',
  })
}

export async function cumulativeVotes(pos: 'pres' | 'vice') {
  interface CumulativeVotes {
    result: Array<{
      timestamp: number
      precinctsTransmitted: number
      data: Array<{
        candidateSlug: string
        voteCount: number
      }>
    }>
  }

  const cumulativeVotes: CumulativeVotes = await fetchCommon(
    'PHCumulativeVotes',
    {
      raceType: `${pos === 'vice' ? 'VICE ' : ''}PRESIDENT PHILIPPINES`,
    }
  )
  return cumulativeVotes
}

export async function latestLocationResults(pos: 'pres' | 'vice') {
  return fetchCommon('latestLocationResults', {
    locationSlug: 'philippines',
    raceType: `${pos === 'vice' ? 'VICE ' : ''}PRESIDENT PHILIPPINES`,
  })
}
