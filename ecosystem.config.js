/**
 * ? pm2 install pm2-server-monit
 * ? pm2 set pm2-server-monit:name engine.commerce.dev
 */

const logDateFormat = 'YYYY-MM-DD HH:mm Z';
const processArgs = '--update-env';
const postUpdateCommands = ['echo "Updating the API.."', 'yarn install'];
const ignoreWatchPaths = [
  './uploads',
  './node_modules',
  '.git',
  '.idea',
  './logs',
];

const getConfigSection = (name, script, logPath, instances) => {
  return {
    name,
    script,
    cwd: './',

    // * When an application crash unexpectedly and the option --exp-backoff-restart-delay is activated,
    // * you will be able to see a new application status waiting restart:
    exp_backoff_restart_delay: 5000,

    // = Log Management
    // * You can disable logs by sending them to /dev/null
    // ? Reference URL: https://pm2.io/doc/en/runtime/guide/log-management/
    output: `./logs/${logPath}/out.log`, // * output is only standard output (console.log)
    error: `./logs/${logPath}/error.log`, // * error is only error output (console.error)

    // = merge_logs {boolean}
    // * In cluster mode, each cluster has his own log files. You can use the merge options to gather all logs into a single file
    merge_logs: true,
    log_date_format: logDateFormat, // * The format must follow a moment.js format, list at https://momentjs.com/docs/#/parsing/string-format/

    // * Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: processArgs,

    // = Load Balancing
    // * The instances option can be:
    // *  - an Integer.  This spreads the app across a specific number of clusters.
    // *  - the String ‘max’.  This spreads the app across all CPU cores.
    // ? Reference URL: https://pm2.io/doc/en/runtime/guide/load-balancing/
    instances,

    // = autorestart
    // * 	true by default. if false, PM2 will not restart your app if it crashes or ends peacefully
    autorestart: true,

    // = restart_delay
    // * time to wait before restarting a crashed app (in milliseconds). defaults to 0.
    restart_delay: 5000,

    // = listen_timeout
    // * time in ms before forcing a reload if app not listening
    listen_timeout: 10000,

    post_update: postUpdateCommands,

    // = Watch & Restart
    // * The watch and restart mode watches the current directory to detect file changes and auto-start.
    // ? Reference URL: https: //pm2.io/doc/en/runtime/features/watch-restart/
    watch: false,

    // * Delay between restart
    // watch_delay: 10000,
    // watch_options: {
    //   followSymlinks: false,
    // },
    exec_interpreter: 'node',
    exec_mode: 'cluster', // * Set the execution mode, possible values: fork|cluster

    max_memory_restart: '5G',
    env: {
      NODE_ENV: 'prod',
    },
    env_production: {
      NODE_ENV: 'prod',
    },
    ignore_watch: ignoreWatchPaths,
  };
};

module.exports = {
  apps: [
    getConfigSection('api', 'dist/index.js', 'api', '1'),
    getConfigSection('scraper', 'dist/workers/scrap.js', 'scrap', '1'),
  ],
};
