"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { apiCall } from "@/helper/apiCall";
import { Moon, Plus, Search, Sun } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AlertConfirmation from "./components/AlertConfirmation";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "motion/react";
import AddExtensionsDialog from "./components/AddExtensions";
import { getData } from "@/lib/utils";

interface IData {
  objectId: string;
  logo: string;
  name: string;
  description: string;
  isActive: boolean;
}

export default function Home() {
  const [data, setData] = useState<IData[]>([]);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [devMode, setDevMode] = useState(false);

  const fetchData = async () => {
    try {
      const fetchData = await getData();
      setData(fetchData);
    } catch (error) {
      console.log(error);
    }
  };
  // filter Data
  const filteredData = data.filter((item) => {
    const matchFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && item.isActive) ||
      (filterStatus === "inactive" && !item.isActive);

    const matchSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchFilter && matchSearch;
  });

  // update isActive
  const btnActive = async (objectId: string, current: boolean) => {
    // update the UI first!
    setData((prevData) =>
      prevData.map((item) =>
        item.objectId === objectId ? { ...item, isActive: !current } : item
      )
    );
    try {
      // console.log(objectId);
      // console.log(isActive);
      const id = objectId;
      const res = await apiCall.put(`/browser_extensions/${id}`, {
        isActive: !current,
      });
      // if update success, send success message!
      toast.success("Successfuly Update Data");
    } catch (error) {
      console.log(error);
      setData((prevData) =>
        prevData.map((item) =>
          item.objectId === objectId ? { ...item, isActive: current } : item
        )
      );
    }
  };

  // remove extension
  const btnRemove = async () => {
    try {
      if (!selectedId) return;
      const res = await apiCall.delete(`/browser_extensions/${selectedId}`);
      toast.success("Successfuly Delete Data");
      setData((prevData) =>
        prevData.filter((item) => item.objectId !== selectedId)
      );
    } catch (error) {
      console.log(error);
    } finally {
      setOpen(false);
      setSelectedId(null);
    }
  };

  // add extension
  const btnAddExtension = async () => {
    setOpenDialog(true);
  };

  const devModeToggle = () => {
    setDevMode((prev) => !prev);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="p-3">
      <nav className="">
        <Card className="py-3">
          <CardContent className="flex items-center justify-between">
            <div className="flex gap-x-2 items-center">
              <Image
                src="/assets/croplogo.svg"
                alt="navlogo"
                width={40}
                height={40}
                className=""
              ></Image>
              <p className="text-2xl font-bold dark:text-white">Extensions</p>
            </div>
            <motion.div
              whileTap={{ scale: 0.8 }}
              className="flex gap-x-5 bg-gray-200 dark:bg-gray-500/30 p-3 rounded-lg cursor-pointer"
            >
              {mounted &&
                (theme === "light" ? (
                  <Moon
                    size={22}
                    onClick={() => setTheme("dark")}
                    className="cursor-pointer"
                  ></Moon>
                ) : (
                  <Sun
                    size={23}
                    color="white"
                    onClick={() => setTheme("light")}
                    className="cursor-pointer "
                  ></Sun>
                ))}
            </motion.div>
          </CardContent>
        </Card>
      </nav>
      <header>
        <div className="md:p-2 mt-5  flex flex-col gap-y-4 md:flex-row md:justify-between  justify-center items-center">
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold">Extensions List</h1>
          </div>
          {/* Search Bar */}
          <div className="w-[80%] md:w-[30%] lg:w-[40%] relative">
            <Input
              className="bg-white"
              placeholder="Search Bar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute top-2 right-2 size-5 text-gray-300" />
          </div>
          {/* Filter List */}
          <div className="">
            <ul className="flex justify-around gap-x-2 items-center">
              <motion.li
                whileTap={{ scale: 0.8, rotate: 10 }}
                className={`rounded-4xl px-4 py-2  shadow-xs text-black cursor-pointer ${
                  filterStatus === "all"
                    ? "bg-gradient-to-br from-pink-500 to-rose-500 text-white"
                    : "bg-white dark:bg-gray-500"
                }`}
                onClick={() => setFilterStatus("all")}
              >
                All
              </motion.li>
              <motion.li
                whileTap={{ scale: 0.8, rotate: 10 }}
                className={`rounded-4xl px-4 py-2  shadow-xs text-black cursor-pointer ${
                  filterStatus === "active"
                    ? "bg-gradient-to-br from-pink-500 to-rose-500 text-white"
                    : "bg-white dark:bg-gray-500"
                }`}
                onClick={() => setFilterStatus("active")}
              >
                Active
              </motion.li>
              <motion.li
                whileTap={{ scale: 0.8, rotate: 10 }}
                className={`rounded-4xl px-4 py-2  shadow-xs text-black cursor-pointer ${
                  filterStatus === "inactive"
                    ? "bg-gradient-to-br from-pink-500 to-rose-500 text-white"
                    : "bg-white dark:bg-gray-500"
                }`}
                onClick={() => setFilterStatus("inactive")}
              >
                Inactive
              </motion.li>
            </ul>
          </div>
        </div>
        {/* Add Extension & Dev Mode */}
        <div className="p-3 mt-5 flex justify-between gap-x-5 items-center">
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              className="bg-blue-600 hover:bg-blue-500 cursor-pointer dark:text-white h-10"
              onClick={btnAddExtension}
            >
              <p className="max-md:hidden flex items-center gap-x-2 text-lg">
                <span className="text-xl">+</span> Add Extension
              </p>
              <p className="md:hidden">+ Extension</p>
            </Button>
          </motion.div>
          <div className="flex gap-x-2 items-center">
            <label>Dev Mode</label>
            <Switch onClick={devModeToggle}></Switch>
          </div>
        </div>
      </header>
      <main
        className={`md:p-3 mt-5 grid gap-5  ${
          filteredData.length > 0
            ? "md:grid-cols-2 xl:grid-cols-4"
            : "grid-cols-1"
        }`}
      >
        {filteredData.length > 0 ? (
          filteredData.map((e) => (
            <AnimatePresence mode="wait" key={e.objectId}>
              <motion.div
                layout
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Card key={e.objectId} className="">
                  <CardContent className="flex items-start gap-x-5">
                    {/* Content */}
                    <Image
                      src={e.logo}
                      alt="serviceicon"
                      width={120}
                      height={120}
                      className="w-20 h-20"
                    ></Image>
                    <div className="flex flex-col">
                      <p className="text-xl font-bold">{e.name}</p>
                      <p className="mt-1 text-sm md:text-lg xl:text-sm text-gray-500">
                        {e.description}
                      </p>
                      <AnimatePresence mode="wait">
                        {devMode && (
                          <motion.p
                            key={e.objectId}
                            className="break-all text-justify mt-1 text-xs md:text-lg xl:text-sm text-gray-500"
                            initial={{ height: 0, y: -10, opacity: 0 }}
                            animate={{ height: "auto", y: 0, opacity: 1 }}
                            exit={{ height: 0, y: -10, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {" "}
                            ID:{" "}
                            {e.objectId
                              .toLowerCase()
                              .slice(0, 20)
                              .trim()
                              .replaceAll("-", "")}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      className="rounded-full cursor-pointer"
                      variant={"secondary"}
                      onClick={() => {
                        setSelectedId(e.objectId);
                        setOpen(true);
                      }}
                    >
                      Remove
                    </Button>
                    <Switch
                      className="data-[state=checked]:bg-red-600 cursor-pointer"
                      checked={e.isActive}
                      onCheckedChange={() => btnActive(e.objectId, e.isActive)}
                    ></Switch>
                  </CardFooter>
                </Card>
              </motion.div>
            </AnimatePresence>
          ))
        ) : (
          <p className=" animate-bounce text-xl text-center ">
            Sorry, data not found ❌
          </p>
        )}
      </main>

      {/* Confirm dialog */}
      <AlertConfirmation open={open} setOpen={setOpen} onConfirm={btnRemove} />
      {/* Add Extension Dialog */}
      <AddExtensionsDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        onSuccess={fetchData}
      />
    </section>
  );
}
