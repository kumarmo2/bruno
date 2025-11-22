import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import store from '../../providers/ReduxStore/';
import { sendRequest, saveRequest } from 'providers/ReduxStore/slices/collections/actions';
import { find } from 'lodash';
// import { saveRequest } from 'providers/ReduxStore/slices/collections/index';
export default function () {
  const activeTabUid = useSelector((state) => state.tabs.activeTabUid);
  const prevTabUidRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fn = async () => {
      if (!activeTabUid) {
        return;
      }
      const fullState = store.getState();

      const { tabs } = fullState;
      const prevTab = find(tabs.tabs, (tab) => {
        return tab.uid === prevTabUidRef.current;
      });
      console.log('>> prevTabUidRef: ', prevTabUidRef.current, ', >>> tabs: ', tabs, ', >>> prevTab: ', prevTab);
      prevTabUidRef.current = activeTabUid;
      if (!prevTab) {
        return;
      }
      dispatch(saveRequest(prevTab.uid, prevTab.collectionUid));
    };
    fn();
  }, [activeTabUid]);
  return null;
}
