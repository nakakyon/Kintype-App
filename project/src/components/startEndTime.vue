<template>
  <v-row>
    <v-col cols="6">
      <v-dialog
        ref="dialog"
        v-model="modal"
        :return-value.sync="syncedStartTime"
        persistent
        width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="syncedStartTime"
            :label="startTimeLabel"
            readonly
            v-bind="attrs"
            outlined
            dense
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker v-if="modal" v-model="syncedStartTime" full-width>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
          <v-btn
            text
            color="primary"
            @click="$refs.dialog.save(syncedStartTime)"
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
        :return-value.sync="syncedEndTime"
        persistent
        width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="syncedEndTime"
            :label="endTimeLabel"
            readonly
            v-bind="attrs"
            outlined
            dense
            :rules="[dateIntegrity]"
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker v-if="modal2" v-model="syncedEndTime" full-width>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="modal2 = false">Cancel</v-btn>
          <v-btn
            text
            color="primary"
            @click="$refs.dialog2.save(syncedEndTime)"
          >
            OK
          </v-btn>
        </v-time-picker>
      </v-dialog>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'nuxt-property-decorator'

@Component({
  components: {},
})
export default class StartEndTime extends Vue {
  @Prop(String)
  labelPrefix!: string

  @PropSync('startTime', { type: String })
  syncedStartTime!: string

  @PropSync('endTime', { type: String })
  syncedEndTime!: string

  modal: boolean = false
  modal2: boolean = false

  get dateIntegrity() {
    return this.syncedStartTime < this.syncedEndTime || '時間を見直して下さい'
  }

  get startTimeLabel() {
    return this.labelPrefix ? this.labelPrefix + '出社時間' : '出社時間'
  }

  get endTimeLabel() {
    return this.labelPrefix ? this.labelPrefix + '退社時間' : '退社時間'
  }
}
</script>
