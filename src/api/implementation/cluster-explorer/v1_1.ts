/* eslint-disable camelcase */

import { KubernetesExplorer } from "../../../components/clusterexplorer/explorer";
import { ClusterExplorerV1_1 } from '../../contract/cluster-explorer/v1_1';

import {
    resolveCommandTarget,
    adaptToExplorerUICustomizer,
    internalNodeContributorOf,
    allNodeSources1,
    NODE_SCHEMA_1_TO_1_1
} from './common';

export function impl(explorer: KubernetesExplorer): ClusterExplorerV1_1 {
    return new ClusterExplorerV1_1Impl(explorer);
}

class ClusterExplorerV1_1Impl implements ClusterExplorerV1_1 {
    constructor(private readonly explorer: KubernetesExplorer) {}

    resolveCommandTarget(target?: any): ClusterExplorerV1_1.ClusterExplorerNode | undefined {
       return resolveCommandTarget(target, NODE_SCHEMA_1_TO_1_1);
    }

    registerNodeContributor(nodeContributor: ClusterExplorerV1_1.NodeContributor): void {
        const adapted = internalNodeContributorOf(nodeContributor, NODE_SCHEMA_1_TO_1_1);
        this.explorer.registerExtender(adapted);
    }

    registerNodeUICustomizer(nodeUICustomizer: ClusterExplorerV1_1.NodeUICustomizer): void {
        const adapted = adaptToExplorerUICustomizer(nodeUICustomizer, NODE_SCHEMA_1_TO_1_1);
        this.explorer.registerUICustomiser(adapted);
    }

    get nodeSources(): ClusterExplorerV1_1.NodeSources {
        return allNodeSources1();
    }

    refresh(): void {
        this.explorer.refresh();
    }
}
