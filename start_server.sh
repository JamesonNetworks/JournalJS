# Shell script to launch node server

kill $(ps aux | grep '[j]ournal_server.js' | awk '{print $2}')
nohup node 'journal_server.js' & 2>&1 | tee -a ~/node_debug.txt ; ( exit ${PIPESTATUS} )