/**
 * @fileoverview Class OTAInput is used to configure and create a process in
 * the backend to to start OTA package generation.
 * @package vue-uuid
 * @package ApiServices
 */
import { uuid } from 'vue-uuid'
import ApiServices from './ApiService.js'

export class OTAConfiguration {
  /**
   * Initialize the input for the api /run/<id>
   */
  constructor() {
    /**
     * Please refer to:
     * https://cs.android.com/android/platform/superproject/+/master:build/make/tools/releasetools/ota_from_target_files.py
     * for the complete and up-to-date configurations that can be set for
     * the OTA package generation.
     * TODO (lishutong): there are dependencies on this flags,
     * disable checkboxes of which dependencies are not fulfilled.
     */
    this.verbose = false,
    this.target = '',
    this.incremental = '',
    this.isIncremental = false,
    this.partial = [],
    this.isPartial = false,
    this.extra_keys = [],
    this.extra = '',
    this.id = uuid.v1()
  }

  /**
   * Start the generation process, will throw an error if not succeed
   */
  async sendForm() {
    for (let flag of OTAExtraFlags) {
      if (this[flag.key]) {
        this.extra_keys.push(flag.key)
      }
    }
    try {
      let response = await ApiServices.postInput(JSON.stringify(this), this.id)
      return response.data
    } catch (err) {
      throw err
    }
  }
}

export const OTABasicFlags = [
  {
    key: 'isIncremental',
    label: 'Incremental OTA',
    requireArg: 'incremental'
  },
  {
    key: 'isPartial',
    label: 'Partial OTA',
    requireArg: 'partial'
  },
  {
    key: 'verbose',
    label: 'Verbose'
  },]

export const OTAExtraFlags = [
  {
    key: 'downgrade',
    label: 'Downgrade',
    depend: ['isIncremental']
  },
  {
    key: 'override_timestamp',
    label: 'Override time stamp'
  },
  {
    key: 'wipe_user_data',
    label: 'Wipe User data'
  },
  //{
  //  key: 'retrofit_dynamic_partitions',
  //  label: 'Support dynamic partition'
  //},
  {
    key: 'skip_compatibility_check',
    label: 'Skip compatibility check'
  },
  //{
  //  key: 'output_metadata_path',
  //  label: 'Output metadata path'
  //},
  {
    key: 'force_non_ab',
    label: 'Generate non-A/B package'
  },
  /** TODO(lishutong): the following comments are flags
  * that requires file operation, will add these functions later.
  */
  //{key: 'oem_settings', label: 'Specify the OEM properties',
  //  requireArg: 'oem_settings_files'},
  //{key: 'binary', label: 'Use given binary', requireArg: 'binary_file',
  //  depend: ['force_non_ab']},
  {
    key: 'block',
    label: 'Block-based OTA',
    depend: ['force_non_ab']
  },
  //{key: 'extra_script', label: 'Extra script', requireArg: 'script_file',
  //  depend: ['force_non_ab']},
  {
    key: 'full_bootloader',
    label: 'Full bootloader',
    depend: ['force_non_ab', 'isIncremental']
  },
  {
    key: 'full_radio',
    label: 'Full radio',
    depend: ['force_non_ab', 'isIncremental']
  },
  //{key: 'log_diff', label: 'Log difference',
  //  requireArg: 'log_diff_path',depend: ['force_non_ab', 'isIncremental']},
  //{key: 'oem_no_mount', label: 'Do not mount OEM partition',
  //  depend: ['force_non_ab', 'oem_settings']},
  //{
  //  key: 'stash_threshold',
  //  label: 'Threshold for maximum stash size',
  //  requireArg: 'stash_threshold_float',
  //  depend: ['force_non_ab']
  //},
  //{
  //  key: 'worker_threads',
  //  label: 'Number of worker threads',
  //  requireArg: 'worker_threads_int',
  //  depend: ['force_non_ab', 'isIncremental']
  //},
  //{
  //  key: 'verify',
  //  label: 'Verify the checksum',
  //  depend: ['force_non_ab', 'isIncremental']
  //},
  {
    key: 'two_step',
    label: 'Generate two-step OTA',
    depend: ['force_non_ab']
  },
  {
    key: 'disable_fec_computation',
    label: 'Disable the on device FEC computation',
    depend: ['isIncremental'],
    exclude: ['force_non_ab']
  },
  {
    key: 'include_secondary',
    label: 'Include secondary slot images',
    exclude: ['force_non_ab', 'isIncremental']
  },
  //{key: 'payload_signer', label: 'Specify the signer',
  //  requireArg: ['payload_signer_singer'], exclude: ['force_non_ab']},
  //{key: 'payload_singer_args', label: 'Specify the args for signer',
  // requireArg: ['payload_signer_args_args], exclude: ['force_non_ab']},
  //{
  //  key: 'payload_signer_maximum_signature_size',
  //  label: 'The maximum signature size (in bytes)',
  //  requireArg: ['payload_signer_maximum_signature_size_int'],
  //  exclude: ['force_non_ab']
  //},
  //{key: 'boot_variable_file', label: 'Specify values of ro.boot.*',
  //  requireArg: ['boot_variable_file_file'], exclude: ['force_non_ab']},
  {
    key: 'skip_postinstall',
    label: 'Skip the postinstall',
    exclude: ['force_non_ab']
  },
  //{key: 'custom_image', label: 'Use custom image',
  // requireArg: ['custom_image_files'], exclude: ['force_non_ab]},
  {
    key: 'disable_vabc',
    label: 'Disable Virtual A/B compression',
    exclude: ['force_non_ab']
  },
  {
    key: 'vabc_downgrade',
    label: "Don't disable VABC for downgrading",
    depend: ['isIncremental', 'downgrade'],
    exclude: ['force_non_ab']
  },
]

/** export const requireArgs = new Map([
  [
    "stash_threshold_float",
    {
      type: "BaseInput",
      label: "Threshold for maximum stash size"
    }
  ],
  [
    "worker_threads",
    {
      type: "BaseInput",
      label: "Number of worker threads"
    }
  ],
  [
    "payload_signer_maximum_signature_size",
    {
      type: "BaseInput",
      label: "The maximum signature size (in bytes)"
    }
  ],
]) */