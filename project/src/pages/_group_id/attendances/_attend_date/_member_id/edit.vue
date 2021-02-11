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
          <v-row>
            <v-col cols="6">
              <v-dialog
                ref="dialog"
                v-model="modal"
                :return-value.sync="startTime"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="startTime"
                    label="出社時間"
                    readonly
                    v-bind="attrs"
                    outlined
                    dense
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker v-if="modal" v-model="startTime" full-width>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modal = false"
                    >Cancel</v-btn
                  >
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dialog.save(startTime)"
                  >
                    OK
                  </v-btn>
                </v-time-picker>
              </v-dialog>
            </v-col>
            <v-col cols="6">
              <v-dialog
                ref="dialog2"
                v-model="modal2"
                :return-value.sync="endTime"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="endTime"
                    label="退社時間"
                    readonly
                    v-bind="attrs"
                    outlined
                    dense
                    :rules="[dateIntegrity]"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker v-if="modal2" v-model="endTime" full-width>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modal2 = false"
                    >Cancel</v-btn
                  >
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dialog2.save(endTime)"
                  >
                    OK
                  </v-btn>
                </v-time-picker>
              </v-dialog>
            </v-col>
          </v-row>
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
import { Context } from '@nuxt/types'

@Component({
  components: {},
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
  modal: boolean = false
  modal2: boolean = false
  reason: string = ''
  name: string = ''
  attendDate: string = ''

  required = (v: string) => !!v || '入力して下さい'
  get dateIntegrity() {
    return this.startTime < this.endTime || '時間を見直して下さい'
  }

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
