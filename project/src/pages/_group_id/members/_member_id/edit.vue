<template>
  <v-theme-provider light>
    <v-form ref="form">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-text-field
            v-model="userName"
            label="名前*"
            outlined
            dense
            :rules="[required]"
          ></v-text-field>
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
                    label="基本出社時間"
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
                    label="基本退社時間"
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
        <v-col cols="12" md="8" class="text-center">
          <v-btn color="grey" outlined large @click="submit">
            <span class="grey--text text--darken-1 font-weight-bold">
              更新
            </span>
          </v-btn>
          <v-btn color="red" outlined large class="ml-12" @click="del">
            <span class="red--text text--darken-1 font-weight-bold">
              削除
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

@Component({
  components: {},
})
export default class New extends Vue {
  userName: string = ''
  startTime: string = ''
  endTime: string = ''
  modal: boolean = false
  modal2: boolean = false

  required = (v: string) => !!v || '入力して下さい'
  get dateIntegrity() {
    return this.startTime < this.endTime || '時間を見直して下さい'
  }

  created() {
    const db = firebase.firestore()
    const member = db
      .collection('groups')
      .doc(this.$route.params.group_id)
      .collection('members')
      .doc(this.$route.params.member_id)

    member.get().then(snapshot => {
      const getData: any = snapshot.data()
      if (getData) {
        this.userName = getData.name
        this.startTime = getData.start_time
        this.endTime = getData.end_time
      } else {
        this.$router.push({ path: `/` })
      }
    })
  }

  submit() {
    // eslint-disable-next-line
    if(!(this.$refs as any).form.validate()){
      return
    }
    const db = firebase.firestore()
    const member = db
      .collection('groups')
      .doc(this.$route.params.group_id)
      .collection('members')
      .doc(this.$route.params.member_id)

    member.set(
      {
        name: this.userName,
        start_time: this.startTime,
        end_time: this.endTime,
      },
      { merge: true }
    )
    this.$router.push({ path: `/${this.$route.params.group_id}/members` })
  }

  del() {
    const db = firebase.firestore()
    db.collection('groups')
      .doc(this.$route.params.group_id)
      .collection('members')
      .doc(this.$route.params.member_id)
      .delete()
    this.$router.push({ path: `/${this.$route.params.group_id}/members` })
  }
}
</script>
