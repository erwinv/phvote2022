import _ from 'lodash'
import { DateTime } from 'luxon'
import { stringify as toCsv } from 'csv-stringify/sync'
import * as fetch from '../lib/fetch'

async function main() {
  const cumulativeVotes = await fetch.cumulativeVotes('vice')

  const cumulativeVotesFmt = cumulativeVotes.result.map(
    ({ precinctsTransmitted, timestamp, data }) => {
      const flattenedData = Object.fromEntries(
        data.map(
          ({ candidateSlug, voteCount }) => [candidateSlug, voteCount] as const
        )
      )

      return {
        isoDateTime: DateTime.fromMillis(timestamp)
          .setZone('Asia/Manila')
          .toISO(),
        timestamp,
        precinctsTransmitted,
        ...flattenedData,
      }
    }
  )

  console.info(toCsv(cumulativeVotesFmt, { header: true }))
}

main()
