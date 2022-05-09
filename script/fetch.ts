import _ from 'lodash'
import { DateTime } from 'luxon'
import { stringify as toCsv } from 'csv-stringify/sync'
import * as fetch from '../lib/fetch'

async function main() {
  const [, , pos] = process.argv

  const cumulativeVotes = await fetch.cumulativeVotes(
    pos === '--vice' ? 'vice' : 'pres'
  )

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

  console.info(toCsv(cumulativeVotesFmt, { header: true, delimiter: '\t' }))
}

main()
