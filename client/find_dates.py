import os

files = [
    'src/pages/Staff/StaffAssignmentsPage.js',
    'src/pages/Staff/StaffAttendancePage.js',
    'src/pages/Staff/StaffCertificatesPage.js',
    'src/pages/Staff/StaffDoubtCenterPage.js',
    'src/pages/Staff/StaffMeetingsPage.js',
    'src/pages/Staff/StaffQuizPage.js',
    'src/pages/StaffDashboardPage.js',
]

for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    print(f'=== {fpath} ===')
    for i, line in enumerate(lines):
        if any(kw in line for kw in ['toLocaleDateString', 'toLocaleString', 'new Date', 'type="date"', "type='date'"]):
            print(f'  L{i+1}: {line.rstrip()}')
    print()
