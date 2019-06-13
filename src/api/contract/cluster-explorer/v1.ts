// This module is contractual and should not be changed after release.
// It should be in sync with vscode-kubernetes-tools-api/ts/explorer-tree/v1.ts
// at all times.

import * as vscode from 'vscode';

export interface ClusterExplorerV1 {
    resolveCommandTarget(target?: any): ClusterExplorerV1.ClusterExplorerNode | undefined;
    registerNodeContributor(nodeContributor: ClusterExplorerV1.NodeContributor): void;
    readonly nodeSources: ClusterExplorerV1.NodeSources;
    registerNodeUICustomizer(nodeUICustomizer: ClusterExplorerV1.NodeUICustomizer): void;
    registerKind(manifestKind: string, abbreviation: string, kindUIDescriptor: ClusterExplorerV1.ResourceKindUIDescriptor): void;
    refresh(): void;
}

export namespace ClusterExplorerV1 {
    export interface NodeContributor {
        contributesChildren(parent: ClusterExplorerV1.ClusterExplorerNode | undefined): boolean;
        getChildren(parent: ClusterExplorerV1.ClusterExplorerNode | undefined): Promise<Node[]>;
    }

    export interface NodeUICustomizer {
        customize(node: ClusterExplorerNode, treeItem: vscode.TreeItem): void | Thenable<void>;
    }

    export interface ResourceKindUIDescriptor {
        readonly lister?: () => NodeSource;
        readonly children?: (r: ResourceSummary) => NodeSource[];
        readonly customize?: (node: ClusterExplorerNode, treeItem: vscode.TreeItem) => void;
    }

    export interface Node {
        getChildren(): Promise<Node[]>;
        getTreeItem(): vscode.TreeItem;
    }

    export interface ClusterExplorerResourceNode {
        readonly nodeType: 'resource';
        readonly namespace: string | null;
        readonly resourceKind: ResourceKind;
        readonly name: string;
        readonly metadata?: any;
    }

    export interface ClusterExplorerGroupingFolderNode {
        readonly nodeType: 'folder.grouping';
    }

    export interface ClusterExplorerResourceFolderNode {
        readonly nodeType: 'folder.resource';
        readonly resourceKind: ResourceKind;
    }

    export interface ClusterExplorerContextNode {
        readonly nodeType: 'context';
        readonly name: string;
    }

    // NOTE: It may seem odd to surface inactive contexts as a different node type,
    // rather than a property on CEContextNode. The reason is the adding nodes
    // scenario - typically authors want to add nodes *only* under the active context.
    // With a property, forgetting to check would result in incorrect behaviour in the
    // common case. This way, the common case works naturally and they need to opt in
    // to say 'no I really do want to add nodes to inactive clusters too'.
    export interface ClusterExplorerInactiveContextNode {
        readonly nodeType: 'context.inactive';
        readonly name: string;
    }

    export interface ClusterExplorerConfigDataItemNode {
        readonly nodeType: 'configitem';
        readonly name: string;
    }

    export interface ClusterExplorerErrorNode {
        readonly nodeType: 'error';
    }

    export interface ClusterExplorerHelmReleaseNode {
        readonly nodeType: 'helm.release';
        readonly name: string;
    }

    export interface ClusterExplorerExtensionNode {
        readonly nodeType: 'extension';
    }

    export type ClusterExplorerNode =
        ClusterExplorerResourceNode |
        ClusterExplorerGroupingFolderNode |
        ClusterExplorerResourceFolderNode |
        ClusterExplorerContextNode |
        ClusterExplorerInactiveContextNode |
        ClusterExplorerConfigDataItemNode |
        ClusterExplorerErrorNode |
        ClusterExplorerHelmReleaseNode |
        ClusterExplorerExtensionNode;

    export interface ResourceKind {
        readonly manifestKind: string;
        readonly abbreviation: string;
    }

    export interface NodeSource {
        at(parentFolder: string | undefined): NodeContributor;
        if(condition: () => boolean | Thenable<boolean>): NodeSource;
        filter(predicate: (n: ClusterExplorerNode) => boolean): NodeSource;
        nodes(): Promise<Node[]>;
    }

    export interface NodeSources {
        resourceFolder(displayName: string, pluralDisplayName: string, manifestKind: string, abbreviation: string): NodeSource;
        groupingFolder(displayName: string, contextValue: string | undefined, ...children: NodeSource[]): NodeSource;
        // TODO: follow the groupingFolder pattern wrt children?
        resourceFolderOf(displayName: string, pluralDisplayName: string, manifestKind: string, abbreviation: string, resources: () => NodeSource[]): NodeSource;
        resourcesOf(manifestKind: string, abbreviation: string, resources: ResourcesSpec, children: undefined | ((resource: { name: string; extraInfo: any; }) => NodeSource)): NodeSource;
        resourceOf(manifestKind: string, abbreviation: string, resource: { name: string; extraInfo: any; }, children: undefined | (() => NodeSource)): NodeSource;
    }

    export interface ResourceSummary {
        readonly name: string;
        readonly extraInfo?: any;
    }

    export interface ResourcesSpecAll {
        readonly resources: 'all';
    }

    export interface ResourcesSpecCB {
        readonly resources: 'cb';
        list(): Promise<ReadonlyArray<ResourceSummary>>;
    }

    export interface ResourcesSpecList {
        readonly resources: 'list';
        list: ReadonlyArray<ResourceSummary>;
    }

    export type ResourcesSpec = ResourcesSpecAll | ResourcesSpecCB | ResourcesSpecList;
}
