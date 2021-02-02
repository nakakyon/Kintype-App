/* eslint-disable camelcase */
export interface Attendance {
  start_time: string
  end_time: string
  plan: string
  reason: string
}

export interface Member {
  [key: string]: string | Attendance
  name: string
  start_time: string
  end_time: string
}

export interface Group {
  name: string
  memo: string
}
