"use client"
import { Toolbar } from 'primereact/toolbar';

import { Button } from 'primereact/button';
import { SplitButton } from 'primereact/splitbutton';

export default function FooterBar() {
    //const router = useRouter();
    const items = [
        {
            label: 'Update',
            icon: 'pi pi-refresh'
        },
        {
            label: 'Delete',
            icon: 'pi pi-times'
        },
        {
            label: 'React Website',
            icon: 'pi pi-external-link',
            command: () => {
                window.location.href = 'https://reactjs.org/'
            }
        },
        {   label: 'Upload',
            icon: 'pi pi-upload',
            command: () => {
                //router.push('/fileupload');
            }
        }
    ];

    const startContent = (
        <>
            <Button label="New" icon="pi pi-plus" className="mr-2" />
            <Button label="Upload" icon="pi pi-upload" className="p-button-success" />
            <i className="pi pi-bars text-gray-700 dark:text-white/80 mr-2" />
            <SplitButton label="Save" icon="pi pi-check" model={items} className="p-button-warning"></SplitButton>
        </>
    );

    const endContent = (
        <>
            <Button icon="pi pi-search" className="mr-2" />
            <Button icon="pi pi-calendar" className="p-button-success mr-2" />
            <Button icon="pi pi-times" className="p-button-danger" />
        </>
    );

    return (
        <div className="card">
            <Toolbar start={startContent} end={endContent} />
        </div>
    );
}