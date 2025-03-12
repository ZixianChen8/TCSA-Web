

INSERT INTO public.api_department (code, manager_id)
VALUES ('MEDIA', NULL);

UPDATE public.api_department
SET manager_id = (
	SELECT id
	FROM public.api_member
	WHERE id = 16
)
WHERE code = 'MEDIA';

UPDATE public.api_department
SET manager_id = (
	SELECT id
	FROM public.api_member
	WHERE id = 15
)
WHERE code = 'HR';



--Add members to the department
--This means: we want to insert into department_members retation table.


INSERT INTO public.api_department_members (department_id, member_id)
SELECT '3', id --we now take a the number 1, and we take the id of the member
FROM public.api_member --from member table
WHERE department = 'FN'; --from member talbe, but only for the members where the department attribute of the member is 'ME'



SELECT * FROM public.api_department;

