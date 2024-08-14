# openagi-server

Start full stack automatically by running

```bash
./start.sh
```

in the root dir of this project.

## BullMQ

Queues can be examined in http://localhost:7777/admin/queues after project is
started.

## Quick iteration

For quick iteration while developing, you can run from root of the project:

```bash
./reset.sh && ./start.sh
```

This will destroy all stale data and gave you fresh start every time.
