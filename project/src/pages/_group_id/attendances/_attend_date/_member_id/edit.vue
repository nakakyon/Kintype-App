<template>
  <v-theme-provider light>
    <v-form ref="form">
      <v-row justify="center">
        <v-col cols="12" md="8">
          {{ name }}さんの{{ this.$timeYMDLabel(attendDate) }}の勤怠
        </v-col>
        <v-col cols="12" md="8">
          <v-select
            v-model="plan"
            :items="planItems"
            label="予定*"
            :rules="[required]"
            dense
            outlined
          />
        </v-col>

        <v-col cols="12" md="8">
          <start-end-time
            :start-time.sync="startTime"
            :end-time.sync="endTime"
          ></start-end-time>
        </v-col>
        <v-col cols="12" md="8">
          <v-textarea
            v-model="reason"
            label="理由"
            rows="2"
            outlined
            dense
          ></v-textarea>
        </v-col>
        <v-col cols="12" md="8" class="text-center">
          <v-btn color="grey" outlined large @click="submit">
            <span class="grey--text text--darken-1 font-weight-bold">
              登録
            </span>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-theme-provider>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import firebase from '@/plugins/firebase'
import { Member, Attendance } from '@/datas/types'
import startEndTime from '@/components/startEndTime.vue'
import { Context } from '@nuxt/types'

@Component({
  components: { startEndTime },
})
export default class Edit extends Vue {
  plan: string = ''
  planItems: string[] = [
    '',
    '出社',
    '在宅勤務',
    '休日出社',
    '有給休暇',
    '時間有休',
    '午前有休',
    '午後有休',
    '振替休日',
    '代休',
    '特別有休',
    '欠勤',
    '遅延',
    'その他',
  ]

  startTime: string = ''
  endTime: string = ''
  reason: string = ''
  name: string = ''
  attendDate: string = ''

  required = (v: string) => !!v || '入力して下さい'

  async asyncData(context: Context) {
    const attendDate = context.params.attend_date
    const db = firebase.firestore()
    const member = db
      .collection('groups')
      .doc(context.params.group_id)
      .collection('members')
      .doc(context.params.member_id)

    const snapshot = await member.get()
    const mdata = snapshot.data() as Member
    const name = mdata.name
    if (attendDate in mdata) {
      const adata = mdata[attendDate] as Attendance
      const startTime = adata.start_time
      const endTime = adata.end_time
      const plan = adata.plan
      const reason = adata.reason
      return { name, startTime, endTime, plan, reason }
    } else {
      const startTime = mdata.start_time
      const endTime = mdata.end_time
      return { name, startTime, endTime }
    }
  }

  created() {
    this.attendDate = this.$route.params.attend_date
  }

  async submit() {
    if (!(this.$refs as any).form.validate()) {
      return
    }
    const db = firebase.firestore()
    await db
      .collection('groups')
      .doc(this.$route.params.group_id)
      .collection('members')
      .doc(this.$route.params.member_id)
      .set(
        {
          [this.attendDate]: {
            start_time: this.startTime,
            end_time: this.endTime,
            plan: this.plan,
            reason: this.reason,
          },
        },
        { merge: true }
      )
    if (this.attendDate === this.$timeYMD()) {
      this.$router.push({
        path: `/${this.$route.params.group_id}`,
      })
    } else {
      this.$router.push({
        path: `/${this.$route.params.group_id}/attendances/${this.attendDate}`,
      })
    }
  }
}
</script>
