/**!
 * @name svelte-store-persisted
 * @author Alan chen
 * @since 2020/1/17
 * @license Anti996
 */

export declare interface options {
    key?: string;
    paths?: string[];
    filter?: (storeName?: string, type?: string) => boolean;
    storage?: Storage;
}

/**
 * persisted state plugin, synchronous data between store and storage, will trigger while store's initialization and every mutaion.
 */
export default ({
    key = "svelte-store",
    paths = [],
    filter = () => true,
    storage = window.localStorage
}: options = {}) => {
    return (store: any) => {
        /**
         * use globally if store'name existed.
         */
        if (store.willUseGlobalPlugin && store.name) {
            key = store.name;
        }
        const canWriteStorage = (): boolean => {
            try {
                storage.setItem("@@", "1");
                storage.removeItem("@@");
                return true;
            } catch (e) { }

            return false
        }

        const hasStorageCache = (): boolean => {
            return getState() !== null;
        }

        const getState = (): (object | undefined) => {
            try {
                return JSON.parse(storage.getItem(key));
            } catch (e) { }

            return undefined;
        }

        const setState = (val: object) => {
            try {
                let clone = JSON.parse(JSON.stringify(val));
                for (const v of Object.keys(val)) {
                    if (paths.length > 0 && !paths.includes(v)) {
                        delete clone[v];
                    }
                }
                storage.setItem(key, JSON.stringify(clone));
            } catch (e) {
                console.log("storage set state error:", e);
            }
        }

        const syncStore = (val: object) => {
            store._state.update((v: object) => {
                let clone = JSON.parse(JSON.stringify(v));
                for (const k of Object.keys(val)) {
                    if (clone.hasOwnProperty(k)) {
                        clone[k] = val[k];
                    }
                }
                return clone;
            });
        }

        if (canWriteStorage()) {
            /**
             * init store and storage data sync.
             */
            if (hasStorageCache()) {
                syncStore(getState());
            } else {
                if (
                    typeof filter === "function" &&
                    filter(store.name)
                ) {
                    setState(store.state());
                }
            }

            store.$subscribe("mutation", ({ type }) => {
                /**
                 * must config the key one more time!
                 */
                if (store.willUseGlobalPlugin && store.name) {
                    key = store.name;
                }
                if (
                    typeof filter === "function" &&
                    filter(store.name, type)
                ) {
                    setState(store.state());
                }
            });
        } else {
            console.warn("your browser does not support storage");
        }
    }
}