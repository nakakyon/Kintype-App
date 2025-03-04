<template>
  <v-theme-provider>
    <v-row justify="center">
      <v-col v-if="attendanceList.length === 0" cols="12" md="8">
        利用者が追加されていません<br />
        <nuxt-link :to="`/${$route.params.group_id}/members/new`"
          >こちら</nuxt-link
        >から利用者の追加を行って下さい
      </v-col>
      <template v-else>
        <v-snackbar
          v-model="snackbar"
          :vertical="true"
          :timeout="5000"
          absolute
          centered
          outlined
          color="primary"
          text
          style="white-space: pre-wrap;"
        >
          <span class="black--text">{{ text }}</span>
          <template #action="{ attrs }">
            <v-btn text v-bind="attrs" @click="snackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
        <v-col cols="12" md="8" class="ml-2 mb-2 pa-0">
          <span class="attend-date-select">
            <v-select
              v-model="dateSelect"
              :items="dateItems"
              item-text="label"
              item-value="value"
              dense
              outlined
              style="width: 350px"
              class="ma-0 pa-0"
              @input="changeRoute"
            >
              <template #append-outer>
                <span class="body-2" style="white-space: nowrap"
                  >の勤怠を表示しています</span
                >
              </template>
            </v-select>
          </span>
        </v-col>
        <v-col cols="12" md="8">
          <v-row>
            <v-col cols="3" class="font-weight-black l-border">名前</v-col>
            <v-col cols="3" class="font-weight-black l-border">予定</v-col>
            <v-col cols="4" class="font-weight-black l-border">
              出退社時間
            </v-col>
            <v-col cols="2" class="font-weight-black lr-border">登録</v-col>
          </v-row>

          <v-row v-for="a in attendanceList" :key="a.id">
            <v-col cols="3" class="l-border">{{ a.name }}</v-col>
            <!-- <v-col
              v-if="a.reason.length > 0"
              cols="3"
              class="l-border"
              style="position:relative"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <div v-bind="attrs" v-on="on">
                    <span class="circle" />
                    {{ a.plan }}
                  </div>
                </template>
                <span>{{ a.reason }}</span>
              </v-tooltip>
            </v-col> -->
            <v-col
              v-if="a.reason.length > 0"
              cols="3"
              class="l-border"
              style="position:relative; cursor: pointer"
              @click="displaySnackbar(a.reason)"
            >
              <span class="circle" />
              {{ a.plan }}
            </v-col>
            <v-col v-else cols="3" class="l-border">
              {{ a.plan }}
            </v-col>
            <v-col cols="4" class="l-border">
              {{ a.startTime }}/{{ a.endTime }}
            </v-col>
            <v-col cols="2" class="lr-border">
              <v-icon style="cursor: pointer" @click="$router.push(a.route)">
                mdi-pencil
              </v-icon>
            </v-col>
          </v-row>
        </v-col>
      </template>
    </v-row>
  </v-theme-provider>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import firebase from '@/plugins/firebase'
import { Member, Attendance } from '@/datas/types'
import { Context } from '@nuxt/types'

@Component({
  components: {},
})
export default class Index extends Vue {
  attendDate: string = ''
  dateSelect: {
    label: string
    value: string
  } = { label: '', value: '' }

  dateItems: {
    label: string
    value: string
  }[] = []

  attendanceList: {
    id: string
    name: string
    startTime: string
    endTime: string
    plan: string
    reason: string
    route: string
  }[] = []

  snackbar: boolean = false
  text: string = ''

  async asyncData(context: Context) {
    const db = firebase.firestore()
    const members = db
      .collection('groups')
      .doc(context.params.group_id)
      .collection('members')

    const snapShot = await members.get()

    const workBreaks = ['有給休暇', '振替休日', '代休', '特別有休', '欠勤']
    const attendDate = context.params.selected_date
      ? context.params.selected_date
      : `${context.app.$timeYMD()}`

    const attendanceList: {
      id: string
      name: string
      startTime: string
      endTime: string
      plan: string
      reason: string
      route: string
    }[] = []

    snapShot.docs.map(doc => {
      const mdata = doc.data() as Member
      if (attendDate in mdata) {
        const adata = mdata[attendDate] as Attendance
        attendanceList.push({
          id: doc.id,
          name: mdata.name,
          startTime: workBreaks.includes(adata.plan)
            ? '--:--'
            : adata.start_time,
          endTime: workBreaks.includes(adata.plan) ? '--:--' : adata.end_time,
          plan: adata.plan,
          reason: adata.reason,
          route: `/${context.params.group_id}/attendances/${attendDate}/${doc.id}/edit`,
        })
      } else {
        attendanceList.push({
          id: doc.id,
          name: mdata.name,
          startTime: mdata.start_time,
          endTime: mdata.end_time,
          plan: '未定',
          reason: '',
          route: `/${context.params.group_id}/attendances/${attendDate}/${doc.id}/edit`,
        })
      }
      return ''
    })
    return { attendanceList }
  }

  created() {
    if (this.$route.params.selected_date) {
      this.attendDate = this.$route.params.selected_date
      this.dateSelect = this.createDateObject(this.attendDate)
    } else {
      this.attendDate = `${this.$timeYMD()}`
      this.dateSelect = this.createDateObject(new Date())
    }
    this.createDateItems()
  }

  createDateItems() {
    if (this.dateItems.length === 0) {
      const start = new Date()
      const end = new Date()
      start.setDate(start.getDate() - 3)
      end.setDate(end.getDate() + 3)

      // eslint-disable-next-line no-unmodified-loop-condition
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        this.dateItems.push(this.createDateObject(d))
      }
    }
  }

  createDateObject(d: Date | string) {
    return {
      label: `${this.$timeYMDLabel(d)}`,
      value: `${this.$timeYMD(d)}`,
    }
  }

  changeRoute(value: string) {
    if (value === this.$timeYMD()) {
      this.$router.push({
        path: `/${this.$route.params.group_id}`,
      })
    } else {
      this.$router.push({
        path: `/${this.$route.params.group_id}/attendances/${value}`,
      })
    }
  }

  displaySnackbar(reason: string) {
    this.text = reason
    this.snackbar = true
  }
}
</script>

<style>
.circle {
  position: absolute;
  top: 5px;
  left: 3px;
  width: 0.5rem;
  height: 0.5rem;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  /* background-color: lime; */
  background-color: var(--v-info-base);
}
.l-border {
  border-left: 1px solid lightgray;
}
.lr-border {
  border-left: 1px solid lightgray;
  border-right: 1px solid lightgray;
}
.attend-date-select > .v-text-field.v-select .v-input__control,
.attend-date-select > .v-text-field.v-select .v-input__append-outer {
  height: 40px;
}
.attend-date-select > .v-text-field.v-select .v-input__append-outer {
  display: -webkit-flex;
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  justify-content: center;
}
</style>
