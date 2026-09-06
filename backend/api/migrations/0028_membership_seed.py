from datetime import date

from django.db import migrations


def seed_membership(apps, schema_editor):
    MembershipType = apps.get_model("api", "MembershipType")
    MembershipSettings = apps.get_model("api", "MembershipSettings")
    Group = apps.get_model("auth", "Group")
    Permission = apps.get_model("auth", "Permission")
    ContentType = apps.get_model("contenttypes", "ContentType")

    types = [
        {
            "slug": "early-bird",
            "name": "Early Bird Membership",
            "price_cad": "20.00",
            "valid_from": date(2026, 9, 1),
            "valid_until": date(2027, 8, 31),
            "is_open": True,
        },
        {
            "slug": "regular",
            "name": "Regular Membership",
            "price_cad": "25.00",
            "valid_from": date(2026, 9, 1),
            "valid_until": date(2027, 8, 31),
            "is_open": True,
        },
        {
            "slug": "winter",
            "name": "Winter Membership",
            "price_cad": "15.00",
            "valid_from": date(2027, 1, 1),
            "valid_until": date(2027, 8, 31),
            "is_open": True,
        },
    ]
    for row in types:
        MembershipType.objects.update_or_create(slug=row["slug"], defaults=row)

    MembershipSettings.objects.get_or_create(
        pk=1,
        defaults={
            "payee_name": "TCSA",
            "interac_email": "finance@tcsaofficial.com",
            "instruction_text": (
                "Send an Interac e-transfer for the exact amount. "
                "Put your member ID in the memo so VP Finance can match your payment."
            ),
            "contact_email": "membership@tcsaofficial.com",
        },
    )

    group_names = ["Membership Coordinator", "VP Finance", "Event Lead"]
    for name in group_names:
        Group.objects.get_or_create(name=name)

    def perms_for(model_name):
        ct = ContentType.objects.filter(app_label="api", model=model_name).first()
        if not ct:
            return []
        return list(Permission.objects.filter(content_type=ct))

    coordinator = Group.objects.get(name="Membership Coordinator")
    finance = Group.objects.get(name="VP Finance")
    event_lead = Group.objects.get(name="Event Lead")

    for model_name in (
        "clubmember",
        "membershipapplication",
        "membershipstatuslog",
        "membershiptype",
        "memberevent",
        "membereventsignup",
        "membershipsettings",
    ):
        coordinator.permissions.add(*perms_for(model_name))

    finance.permissions.add(*perms_for("membershippayment"))
    finance.permissions.add(*perms_for("clubmember"))

    event_lead.permissions.add(*perms_for("memberevent"))
    event_lead.permissions.add(*perms_for("membereventsignup"))


def unseed_membership(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0027_membership_models"),
        ("auth", "0012_alter_user_first_name_max_length"),
        ("contenttypes", "0002_remove_content_type_name"),
    ]

    operations = [
        migrations.RunPython(seed_membership, unseed_membership),
    ]
