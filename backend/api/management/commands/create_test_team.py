from django.core.management.base import BaseCommand
from api.models import Member

class Command(BaseCommand):
    help = 'Creates test team members if they do not exist'

    def handle(self, *args, **kwargs):
        # Create test team members
        members = [
            {
                'first_name': 'John',
                'last_name': 'Doe',
                'email': 'john.doe@example.com',
                'position': 'President',
                'department': 'Executive',
                'description': 'Leads the organization and oversees all departments',
                'pfp_url': 'https://via.placeholder.com/150',
            },
            {
                'first_name': 'Jane',
                'last_name': 'Smith',
                'email': 'jane.smith@example.com',
                'position': 'Vice President',
                'department': 'Executive',
                'description': 'Assists the president and manages day-to-day operations',
                'pfp_url': 'https://via.placeholder.com/150',
            },
            {
                'first_name': 'Michael',
                'last_name': 'Johnson',
                'email': 'michael.johnson@example.com',
                'position': 'Treasurer',
                'department': 'Finance',
                'description': 'Manages the organization budget and financial planning',
                'pfp_url': 'https://via.placeholder.com/150',
            },
            {
                'first_name': 'Emily',
                'last_name': 'Williams',
                'email': 'emily.williams@example.com',
                'position': 'Secretary',
                'department': 'Administration',
                'description': 'Maintains records and handles communication',
                'pfp_url': 'https://via.placeholder.com/150',
            },
            {
                'first_name': 'David',
                'last_name': 'Brown',
                'email': 'david.brown@example.com',
                'position': 'Events Director',
                'department': 'Events',
                'description': 'Plans and coordinates all organization events',
                'pfp_url': 'https://via.placeholder.com/150',
            },
            {
                'first_name': 'Sarah',
                'last_name': 'Davis',
                'email': 'sarah.davis@example.com',
                'position': 'Marketing Director',
                'department': 'Marketing',
                'description': 'Leads marketing and promotional efforts',
                'pfp_url': 'https://via.placeholder.com/150',
            },
            {
                'first_name': 'Kevin',
                'last_name': 'Miller',
                'email': 'kevin.miller@example.com',
                'position': 'Outreach Coordinator',
                'department': 'Community Relations',
                'description': 'Manages relationships with external organizations',
                'pfp_url': 'https://via.placeholder.com/150',
            },
            {
                'first_name': 'Lisa',
                'last_name': 'Wilson',
                'email': 'lisa.wilson@example.com',
                'position': 'Member',
                'department': 'Events',
                'description': 'Assists with event planning and execution',
                'pfp_url': 'https://via.placeholder.com/150',
            },
            {
                'first_name': 'Tom',
                'last_name': 'Taylor',
                'email': 'tom.taylor@example.com',
                'position': 'Member',
                'department': 'Marketing',
                'description': 'Helps with social media and content creation',
                'pfp_url': 'https://via.placeholder.com/150',
            },
            {
                'first_name': 'Amy',
                'last_name': 'Anderson',
                'email': 'amy.anderson@example.com',
                'position': 'Member',
                'department': 'Finance',
                'description': 'Assists with budget planning and financial reports',
                'pfp_url': 'https://via.placeholder.com/150',
            },
        ]

        # Print existing members
        existing_members = Member.objects.all()
        self.stdout.write("\nExisting team members in database:")
        for member in existing_members:
            self.stdout.write(f"- {member.first_name} {member.last_name} ({member.position})")

        # Add new members only if they don't exist
        for member_data in members:
            member, created = Member.objects.get_or_create(
                first_name=member_data['first_name'],
                last_name=member_data['last_name'],
                defaults=member_data
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created new team member: {member.first_name} {member.last_name} ({member.position})')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Team member already exists: {member.first_name} {member.last_name}')
                ) 