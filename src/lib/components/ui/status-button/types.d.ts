export type Status = 'scheduled' | 'planning' | 'done';

export type StatusButtonProps = {
	class?: string;
	status: Status;
};
