import { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { ProgressSpinner } from "primereact/progressspinner";
const Admin = () => {
  let emptyDetails = {
    id: null,
    name: "",
    email: "",
    role: "",
  };
  const [members, setMembers] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.IN },
    role: { value: null, matchMode: FilterMatchMode.IN },
  });

  const [deletememberDialog, setDeleteMemberDialog] = useState(false);
  const [deletemembersDialog, setDeleteMembersDialog] = useState(false);
  const [member, setMember] = useState(emptyDetails);
  const [selectedMembers, setSelectedMembers] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const getData = async () => {
    const response = await fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    );
    const data = await response.json();
    setMembers(data);
  };

  useEffect(() => {
    getData();
  }, []);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilter(value);
  };

  const header = (
    <div className='flex flex-wrap gap-2 align-items-center justify-content-between'>
      <span className='p-input-icon-left'>
        <i className='pi pi-search search-icon' />
        <InputText
          type='search'
          onChange={onGlobalFilterChange}
          placeholder='Search..'
          className='search-icon'
        />
      </span>
      <Button
        label='Delete Selected'
        icon='pi pi-trash'
        severity='danger'
        onClick={() => setDeleteMembersDialog(true)}
        disabled={!selectedMembers || !selectedMembers.length}
      />
    </div>
  );

  const confirmDeleteMember = (member) => {
    setMember(member);
    setDeleteMemberDialog(true);
  };
  const deleteMember = () => {
    let _members = members.filter((val) => val.id != member.id);
    setMembers(_members);
    setDeleteMemberDialog(false);
    setMember(emptyDetails);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Member Deleted",
      life: 3000,
    });
  };
  const deleteSelectedMembers = () => {
    let _members = members.filter((val) => !selectedMembers.includes(val));
    setMembers(_members);
    setDeleteMembersDialog(false);
    setSelectedMembers(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Members Deleted",
      life: 3000,
    });
  };

  const hideDeleteMemberDialog = () => {
    setDeleteMemberDialog(false);
  };

  const hideDeleteMembersDialog = () => {
    setDeleteMembersDialog(false);
  };

  const deleteMemberDialogFooter = (
    <>
      <Button
        label='No'
        icon='pi pi-times'
        outlined
        onClick={
          deletememberDialog == true
            ? hideDeleteMemberDialog
            : hideDeleteMembersDialog
        }
      />
      <Button
        label='Yes'
        icon='pi pi-check'
        severity='danger'
        outlined
        onClick={
          deletememberDialog == true ? deleteMember : deleteSelectedMembers
        }
      />
    </>
  );

  const onInputChange = (e) => {
    let _members = [...members];
    let { newData, index } = e;
    _members[index] = newData;

    setMembers(_members);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Member Updated",
      life: 3000,
    });
  };

  const textEditor = (options, name) => {
    return (
      <div className='flex flex-column'>
        <InputText
          id={name}
          value={options.value}
          onChange={(e) => options.editorCallback(e.target.value)}
          required
          className={classNames({ "p-invalid": !options.value })}
        />
        {!options.value && (
          <small className='p-error'>{name} is required.</small>
        )}
      </div>
    );
  };
  const deleteButton = (rowData) => {
    return (
      <Button
        icon='pi pi-trash'
        rounded
        outlined
        severity='danger'
        className='mr-2 delete'
        onClick={() => confirmDeleteMember(rowData)}
      />
    );
  };

  return (
    <div>
      {!members && (
        <ProgressSpinner
          style={{ width: "50px", height: "50px" }}
          strokeWidth='8'
          fill='var(--surface-ground)'
          animationDuration='.5s'
        />
      )}
      {members && (
        <>
          <Toast ref={toast} />
          <div className=' card'>
            <DataTable
              ref={dt}
              selection={selectedMembers}
              value={members}
              onSelectionChange={(e) => setSelectedMembers(e.value)}
              dataKey='id'
              selectionPageOnly
              paginator
              editMode='row'
              onRowEditComplete={onInputChange}
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
              currentPageReportTemplate='Showing {first} to {last} of {totalRecords} members'
              filters={filters}
              globalFilterFields={["name", "email", "role"]}
              header={header}
              tableStyle={{ minWidth: "50rem", maxWidth: "100vw" }}
            >
              <Column selectionMode='multiple' exportable={false}></Column>
              <Column
                field='name'
                header='Name'
                sortable
                editor={(options) => textEditor(options, "name")}
                style={{ minWidth: "12rem" }}
              ></Column>
              <Column
                field='email'
                header='Email'
                sortable
                editor={(options) => textEditor(options, "email")}
                style={{ minWidth: "16rem" }}
              ></Column>
              <Column
                field='role'
                header='Role'
                editor={(options) => textEditor(options, "role")}
              ></Column>
              <Column
                bodyClassName='edit'
                rowEditor
                header='Edit'
                bodyStyle={{ textAlign: "left", paddingBottom: "8px" }}
              />
              <Column
                bodyClassName='delete'
                header='Delete'
                bodyStyle={{ textAlign: "left", paddingBottom: "8px" }}
                body={(data, props) => deleteButton(data)}
              />
            </DataTable>
          </div>
          <Dialog
            visible={deletememberDialog || deletemembersDialog}
            style={{ width: "32rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header='Confirm'
            modal
            footer={deleteMemberDialogFooter}
            onHide={
              deletememberDialog == true
                ? hideDeleteMemberDialog
                : deletemembersDialog == true
                ? hideDeleteMembersDialog
                : true
            }
          >
            <div className='confirmation-content'>
              <i
                className='pi pi-exclamation-triangle mr-3'
                style={{ fontSize: "2rem" }}
              />
              {member && (
                <span>
                  Are you sure you want to delete <b>{member.name}</b>
                </span>
              )}
            </div>
          </Dialog>
        </>
      )}
    </div>
  );
};
export default Admin;
