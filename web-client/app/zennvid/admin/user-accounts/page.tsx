"use client"
import Modal from '@/components/common/Modal';
import { PaginationTable } from '@/components/common/pagination-table'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ResponseData } from '@/constants/response';
import { User } from '@/context/UserProvider';
import { deleteUser, getAllUser, getCSVUsers, updateUser } from '@/lib/apiProvider';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner';
import { CSVDownload, CSVLink } from "react-csv";
const page = () => {

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [tableData, setTableData] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const datePickerColumns = ["createdAt"];
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [csvData, setCsvData] = useState();
  const totalRef = useRef(0);

  const fetchUserMutation = useMutation({
    mutationKey: ['fetch-users'],
    mutationFn: async ({ page, limit, search, createdAt }: {
      page: number,
      limit: number,
      search: string,
      createdAt: Date | undefined,
    }) => {
      const response = await getAllUser({
        page,
        limit,
        search: search,
        createdAt: createdAt
      });
      toast.success(response.MESSAGE);
      return response
    },
    onSuccess: (data: any) => {
      if (data.DATA) {
        setTableData(data.DATA.users?.map((user: any, index: number) => ({
          ...user,
          id: (page - 1) * limit + index + 1,
          createdAt: new Date(user.createdAt).toLocaleDateString(),
        })) || []);
        setTotal(data.DATA.total);
        totalRef.current = data.DATA.total;
      }
    },
    onError: (error) => {
      console.log("Error fetching users:", error);
    }
  })

  const CSVUserQuery = useQuery({
    queryKey: ['csv-users'],
    queryFn: getCSVUsers,
  })



  const deletedMutation = useMutation({
    mutationKey: ['delete-user'],
    mutationFn: async ({ id }: { id: string }) => {
      const response = await deleteUser({ id });
      return response;
    },
    onSuccess: (data: ResponseData) => {
      toast.success(data.MESSAGE);
      setTableData(tableData.filter((user) => user._id !== selectedUser?._id))
    },
    onError: (error) => {
    }
  })


  const updateUserMutation = useMutation({
    mutationKey: ['update-user'],
    mutationFn: async ({ userId, username, credits }: { userId: string, username: string, credits: number }) => {
      const response = await updateUser({ userId, username, credits });
      return response;
    },
    onSuccess: (data: ResponseData) => {
      setTableData(tableData.map((user) => {
        if (user._id === data.DATA?._id) {
          return {
            ...user,
            username: data.DATA?.username,
            credits: data.DATA?.credits,
          }
        }

        return user;
      }));
      toast.success(data.MESSAGE);
    },
    onError: (error) => {
      console.log("Error updating user:", error);
    }
  })

  const pageChange = (newPage: number) => {
    setPage(newPage);
    fetchUserMutation.mutate({ page: newPage, limit, search, createdAt: selectedDate });
  }

  const limitChange = (newLimit: number) => {
    setPage(1);
    setLimit(newLimit);
    fetchUserMutation.mutate({ page: 1, limit: newLimit, search, createdAt: selectedDate });
  }

  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    searchTimerRef.current = setTimeout(() => {
      fetchUserMutation.mutate({ page, limit, search: value, createdAt: selectedDate });
    }, 500);
  };
  const usernameRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (isUpdateOpen) {
      setTimeout(() => {
        usernameRef.current?.setSelectionRange(0, 0);
      }, 50);
    }
  }, [isUpdateOpen]);

  useEffect(() => {
    setPage(1)
    fetchUserMutation.mutate({ page: 1, limit, search, createdAt: selectedDate });
  }, [selectedDate]);

  async function main() {
    if (!csvData) {
      const csvResponse = await CSVUserQuery.refetch();
      if (csvResponse.data && csvResponse.data.DATA) {
        const users = csvResponse.data.DATA;
        setCsvData(users.map((user: any, index: number) => ({
          id: index + 1,
          email: user.email,
          username: user.username,
          role: user.role,
          provider: user.provider,
          credits: user.credits,
          createdAt: new Date(user.createdAt).toLocaleDateString(),
        })));
      }
    }
  }

  useEffect(() => {
    main()
  }, [])

  const updateModal = (
    <div>
      <Label>Username</Label>
      <Input
        autoFocus={false}
        ref={usernameRef}
        type="text"
        value={selectedUser?.username}
        onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
          setSelectedUser((user) => {
            if (!user) return user;
            return {
              ...user,
              username: evt.target.value
            };
          });
        }}
      />
      <Label>Email</Label>
      <Input
        type="email"
        value={selectedUser?.email}
        disabled

      />
      <Label>Credits</Label>
      <Input
        type="number"
        value={selectedUser?.credits}
        onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
          setSelectedUser((user) => {
            if (!user) return user;
            return {
              ...user,
              credits: Number(evt.target.value)
            };
          });
        }}
      />
      <Label>Role</Label>
      <Input
        type="text"
        value={selectedUser?.role}
        disabled
      />
      <Label>Provider</Label>
      <Input
        type="text"
        value={selectedUser?.provider}
        disabled
      />
      <Button
        type="submit"
        className="mt-4 bg-blue-500 text-white hover:bg-blue-600"
        onClick={(e) => {
          e.preventDefault();
          if (selectedUser) {
            updateUserMutation.mutate({
              userId: selectedUser._id,
              username: selectedUser.username,
              credits: selectedUser.credits
            });
            setIsUpdateOpen(false);
          }
        }}
      >
        Update User
      </Button>
      <Button
        type="button"
        className="mt-4 ml-4 bg-gray-500 text-white hover:bg-gray-600"
        onClick={() => {
          setSelectedUser(undefined);
          setIsUpdateOpen(false);
        }}
      >
        Cancel
      </Button>
    </div>
  )

  const deleteModal = (
    <div>
      <p>Are you sure you want to delete user {selectedUser?.username}?</p>
      <Button
        className="mt-4 bg-red-500 text-white hover:bg-red-600"
        onClick={() => {
          if (selectedUser) {
            deletedMutation.mutate({ id: selectedUser._id });
            setIsDeleteOpen(false);
          }
        }}
      >
        Delete
      </Button>
      <Button
        className="mt-4 ml-4 bg-gray-500 text-white hover:bg-gray-600"
        onClick={() => {
          setSelectedUser(undefined);
          setIsDeleteOpen(false);
        }}
      >
        Cancel
      </Button>
    </div>
  )

  const ActionNode = (
    <div>
      <Button
        variant="outline"
        size="sm"
        className="bg-green-500 text-white hover:bg-green-600"
        onClick={() => {
          // handle create new user
        }}
      >
        Create New User
      </Button>
      {csvData && (
        <CSVLink data={csvData} filename="users.csv">
          <Button
            variant="outline"
            size="sm"
            className="bg-yellow-500 text-white hover:bg-yellow-600 ml-3"
          >
            Download CSV
          </Button>
        </CSVLink>
      )}
    </div>
  )

  const columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'username', header: 'Username' },
    { accessorKey: 'role', header: 'Role' },
    { accessorKey: 'provider', header: 'Provider' },
    { accessorKey: 'credits', header: 'Credits' },
    { accessorKey: 'createdAt', header: 'Created At' },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => {
        return (
          <div>
            {/* update button */}
            <Button
              variant="outline"
              size="sm"
              className="mr-2 bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => {
                // handle update
                setSelectedUser(row.original);
                setIsUpdateOpen(true);
              }}
            >
              Update
            </Button>
            {/* delete button */}
            <Button
              variant="outline"
              size="sm"
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={() => {
                // handle delete
                setSelectedUser(row.original);
                setIsDeleteOpen(true);
              }}
            >
              Delete
            </Button>
          </div>
        )

      }
    }
  ];




  return (
    <div className='ml-[25vw] mt-16'>
      <h1>User Accounts</h1>
      <Modal
        title='Update Account'
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
      >
        {updateModal}
      </Modal>
      <Modal
        title='Delete Account'
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
      >
        {deleteModal}
      </Modal>
      <PaginationTable
        columns={columns}
        data={tableData}
        page={page}
        limit={limit}
        total={total}
        totalPages={Math.ceil(total / limit)}
        onPageChange={pageChange}
        onLimitChange={limitChange}
        onSearch={handleSearch}
        datePickerColumns={datePickerColumns}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        searchTerm={search}
        isAction={true}
        ActionNode={ActionNode}
      />
    </div>
  )
}

export default page